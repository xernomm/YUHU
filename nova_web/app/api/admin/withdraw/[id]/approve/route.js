import { NextResponse } from 'next/server';
import { Wallet, WalletLedger, WithdrawalRequest, sequelize } from '@/lib/models/index.js';

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

    // 2. Approve the request
    await withdrawReq.update({ status: 'approved' }, { transaction });

    // 3. Fetch and lock the user's wallet
    const wallet = await Wallet.findOne({
      where: { user_id: withdrawReq.user_id },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // 4. Deduct the amount from locked_balance
    const withdrawAmount = Number(withdrawReq.amount);
    const newLocked = Number(wallet.locked_balance) - withdrawAmount;
    await wallet.update({
      locked_balance: newLocked,
    }, { transaction });

    // 5. Log ledger record (debit)
    await WalletLedger.create({
      wallet_id: wallet.id,
      type: 'debit',
      amount: withdrawAmount,
      description: `Withdrawal request #${withdrawReq.id} approved and disbursed`,
      reference_type: 'withdrawal',
      reference_id: String(withdrawReq.id),
    }, { transaction });

    await transaction.commit();

    return NextResponse.json(
      {
        success: true,
        message: 'Withdrawal request approved successfully.',
        data: withdrawReq,
      },
      { status: 200 }
    );
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('Approve Withdrawal Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
