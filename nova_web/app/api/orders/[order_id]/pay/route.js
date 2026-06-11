import { NextResponse } from 'next/server';
import { User, Order, CommissionHistory, Wallet, WalletLedger, sequelize } from '@/lib/models/index.js';

export async function POST(request, { params }) {
  let transaction;
  try {
    const { order_id } = await params;

    if (!order_id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Begin database transaction
    transaction = await sequelize.transaction();

    // 1. Fetch and lock order to prevent race conditions during updates
    const order = await Order.findByPk(order_id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.status !== 'pending') {
      return NextResponse.json(
        { success: false, message: `Order status is "${order.status}". Only pending orders can be processed for payment.` },
        { status: 400 }
      );
    }

    // 2. Update Order status to paid
    await order.update({ status: 'paid' }, { transaction });

    // 3. MLM Logic: Award commissions to uplines recursively (up to 3 levels)
    const buyer = await User.findByPk(order.user_id, { transaction });
    const commissionsCreated = [];

    if (buyer) {
      const buyerPath = buyer.path || '';
      // Path is like: upline1/upline2/buyer_uuid. 
      // Splitting, reversing, and removing buyer itself yields direct sponsor (Level 1) first, etc.
      const uplineIds = buyerPath.split('/').reverse().slice(1);
      
      const levelsCount = Math.min(uplineIds.length, 3);
      const COMMISSION_RATES = [0.05, 0.03, 0.01]; // Level 1: 5%, Level 2: 3%, Level 3: 1%

      for (let i = 0; i < levelsCount; i++) {
        const uplineId = uplineIds[i];
        const rate = COMMISSION_RATES[i];
        const commissionAmount = Number(order.total_amount) * rate;

        // Create Commission record (status: paid since it's directly credited to wallet)
        const commission = await CommissionHistory.create({
          user_id: uplineId,
          order_id: order.id,
          amount: commissionAmount,
          status: 'paid',
        }, { transaction });

        // Fetch and lock the upline's wallet
        const [wallet] = await Wallet.findOrCreate({
          where: { user_id: uplineId },
          defaults: { balance: 0.00, locked_balance: 0.00 },
          transaction,
          lock: transaction.LOCK.UPDATE
        });

        // Credit wallet balance
        const newBalance = Number(wallet.balance) + commissionAmount;
        await wallet.update({ balance: newBalance }, { transaction });

        // Log to WalletLedger
        await WalletLedger.create({
          wallet_id: wallet.id,
          type: 'credit',
          amount: commissionAmount,
          description: `MLM Commission Level ${i + 1} from Order ${order.order_number}`,
          reference_type: 'commission',
          reference_id: String(commission.id),
        }, { transaction });

        commissionsCreated.push(commission);
        console.log(`MLM Commission Level ${i + 1} of ${commissionAmount} credited to Upline ${uplineId} for Order ${order.order_number}`);
      }
    }

    // Commit transaction
    await transaction.commit();

    return NextResponse.json(
      {
        success: true,
        message: 'Payment completed and MLM commissions distributed successfully.',
        data: {
          order,
          commissions: commissionsCreated,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('Payment Processing Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
