import { NextResponse } from 'next/server';
import { CommissionHistory, Order } from '@/lib/models/index.js';

export async function GET(request) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 1. Fetch all commission history records for the authenticated user
    const commissions = await CommissionHistory.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'order_number', 'total_amount', 'status', 'created_at'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    // 2. Aggregate earnings by status
    let totalPending = 0;
    let totalPaid = 0;

    for (const item of commissions) {
      const amountVal = Number(item.amount);
      if (item.status === 'pending') {
        totalPending += amountVal;
      } else if (item.status === 'paid') {
        totalPaid += amountVal;
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Commission data retrieved successfully.',
        data: {
          totalPending,
          totalPaid,
          totalEarned: totalPending + totalPaid,
          commissions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get Commissions Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
