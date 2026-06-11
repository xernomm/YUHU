import { NextResponse } from 'next/server';
import { Order, OrderItem, Product } from '@/lib/models/index.js';

export async function GET(request) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'sku_product', 'nama_product', 'jenis_product', 'main_image'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Order history retrieved successfully',
        data: orders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get Order History Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
