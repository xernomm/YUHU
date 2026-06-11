import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Order, OrderItem, Product, sequelize } from '@/lib/models/index.js';

export async function POST() {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    // 1. Calculate the cutoff time for expiration (2 hours ago)
    const cutoffTime = new Date(Date.now() - 2 * 60 * 60 * 1000);

    // 2. Find all pending orders older than the cutoff
    const expiredOrders = await Order.findAll({
      where: {
        status: 'pending',
        createdAt: {
          [Op.lt]: cutoffTime,
        },
      },
      include: [
        {
          model: OrderItem,
          as: 'items',
        },
      ],
      transaction,
    });

    let cancelledCount = 0;

    // 3. Process each expired order: cancel it and restore inventory stocks
    for (const order of expiredOrders) {
      await order.update({ status: 'cancelled' }, { transaction });

      for (const item of order.items) {
        const product = await Product.findByPk(item.product_id, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (product) {
          const restoredStock = product.stok + item.quantity;
          await product.update({ stok: restoredStock }, { transaction });
        }
      }

      cancelledCount++;
      console.log(`Cancelled expired order ${order.order_number} and returned items stock.`);
    }

    await transaction.commit();

    return NextResponse.json(
      {
        success: true,
        message: `Successfully checked expired orders. Cancelled: ${cancelledCount}.`,
        data: {
          cancelledCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('Cleanup Expired Orders Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
