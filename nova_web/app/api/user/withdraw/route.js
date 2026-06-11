import { NextResponse } from 'next/server';
import { Wallet, WithdrawalRequest, sequelize } from '@/lib/models/index.js';

// GET /api/user/withdraw - List user's withdrawal request history
export async function GET(request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const withdrawals = await WithdrawalRequest.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Withdrawal history retrieved successfully.',
        data: withdrawals,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get Withdrawals Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/user/withdraw - Create a new withdrawal request
export async function POST(request) {
  let transaction;
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, bank, nomor_rekening, pemilik_rekening } = body;

    const withdrawAmount = Number(amount);
    if (!withdrawAmount || withdrawAmount <= 0 || !bank || !nomor_rekening || !pemilik_rekening) {
      return NextResponse.json(
        { success: false, message: 'Invalid withdrawal parameters. Amount must be positive. Bank details are required.' },
        { status: 400 }
      );
    }

    transaction = await sequelize.transaction();

    // 1. Fetch and lock the user's wallet
    const wallet = await Wallet.findOne({
      where: { user_id: userId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // 2. Check balance
    if (Number(wallet.balance) < withdrawAmount) {
      throw new Error(`Insufficient wallet balance. Available: ${wallet.balance}, Requested: ${withdrawAmount}`);
    }

    // 3. Deduct from balance and add to locked_balance
    const newBalance = Number(wallet.balance) - withdrawAmount;
    const newLocked = Number(wallet.locked_balance) + withdrawAmount;
    await wallet.update({
      balance: newBalance,
      locked_balance: newLocked,
    }, { transaction });

    // 4. Create Withdrawal Request record
    const withdrawal = await WithdrawalRequest.create({
      user_id: userId,
      amount: withdrawAmount,
      bank,
      nomor_rekening,
      pemilik_rekening,
      status: 'pending',
    }, { transaction });

    // Commit transaction
    await transaction.commit();

    return NextResponse.json(
      {
        success: true,
        message: 'Withdrawal request submitted successfully.',
        data: withdrawal,
      },
      { status: 201 }
    );
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('Withdrawal Error:', error);
    const isClientError = error.message.includes('Insufficient') || error.message.includes('not found') || error.message.includes('parameters');
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: isClientError ? 400 : 500 }
    );
  }
}
