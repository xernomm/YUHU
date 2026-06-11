import { NextResponse } from 'next/server';
import { Wallet, WithdrawalRequest, sequelize } from '@/lib/models/index.js';

export async function POST(request, { params }) {
  let transaction;
  try {
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Request ID is required.' },
        { status: 400 }
      );
    }

    transaction = await sequelize.transaction();

    // 1. Fetch and lock the withdrawal request
    const withdrawReq = await WithdrawalRequest.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!withdrawReq) {
      return NextResponse.json(
        { success: false, message: 'Withdrawal request not found.' },
        { status: 404 }
      );
    }

    if (withdrawReq.status !== 'pending') {
      return NextResponse.json(
        { success: false, message: `Request is already in status "${withdrawReq.status}".` },
        { status: 400 }
      );
    }

    // 2. Reject the request
    await withdrawReq.update({ status: 'rejected' }, { transaction });

    // 3. Fetch and lock the user's wallet
    const wallet = await Wallet.findOne({
      where: { user_id: withdrawReq.user_id },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // 4. Refund the amount from locked_balance back to balance
    const withdrawAmount = Number(withdrawReq.amount);
    const newBalance = Number(wallet.balance) + withdrawAmount;
    const newLocked = Number(wallet.locked_balance) - withdrawAmount;
    await wallet.update({
      balance: newBalance,
      locked_balance: newLocked,
    }, { transaction });

    await transaction.commit();

    return NextResponse.json(
      {
        success: true,
        message: 'Withdrawal request rejected and funds refunded to wallet successfully.',
        data: withdrawReq,
      },
      { status: 200 }
    );
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('Reject Withdrawal Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
