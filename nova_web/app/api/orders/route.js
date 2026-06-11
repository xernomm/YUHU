import { NextResponse } from 'next/server';
import { Product, Order, OrderItem, sequelize } from '@/lib/models/index.js';

export async function POST(request) {
  let transaction;
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId || !userRole) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, ongkos_kirim = 0, is_external_marketplace = false, marketplace_source = null } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid items array' },
        { status: 400 }
      );
    }

    // Begin database transaction
    transaction = await sequelize.transaction();

    let subtotal = 0;
    const checkoutItems = [];

    // 1. Validate items and verify/lock stock
    for (const item of items) {
      const { product_id, quantity } = item;

      if (!product_id || !quantity || quantity <= 0) {
        throw new Error('Invalid product_id or quantity in items list.');
      }

      // Fetch and lock product row to prevent concurrent purchase issues
      const product = await Product.findByPk(product_id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!product) {
        throw new Error(`Product with ID ${product_id} not found.`);
      }

      if (product.stok < quantity) {
        throw new Error(`Insufficient stock for product "${product.nama_product}". Available: ${product.stok}, Requested: ${quantity}`);
      }

      const itemSubtotal = Number(product.harga) * quantity;
      subtotal += itemSubtotal;

      checkoutItems.push({
        product,
        quantity,
        harga_satuan: product.harga,
      });
    }

    // 2. Calculate dynamic discount based on user role
    const ROLE_DISCOUNTS = {
      member: 0,
      affiliator: 0,
      reseller: 0.15,
      mitra_prioritas: 0.30,
    };
    const discountRate = ROLE_DISCOUNTS[userRole] || 0;
    const besar_discount = subtotal * discountRate;
    const is_discount_applied = besar_discount > 0;
    const jenis_promo = is_discount_applied ? `Role Discount (${userRole})` : null;

    // 3. Final total calculation
    const total_amount = (subtotal - besar_discount) + Number(ongkos_kirim);

    // Generate unique order number
    const order_number = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 10000);

    // 4. Create Order record
    const newOrder = await Order.create({
      user_id: userId,
      order_number,
      status: 'pending',
      subtotal,
      ongkos_kirim,
      is_discount_applied,
      jenis_promo,
      besar_discount,
      total_amount,
      is_external_marketplace,
      marketplace_source,
    }, { transaction });

    // 5. Create OrderItems and deduct Product stocks
    for (const checkoutItem of checkoutItems) {
      const { product, quantity, harga_satuan } = checkoutItem;

      // Create OrderItem details
      await OrderItem.create({
        order_id: newOrder.id,
        product_id: product.id,
        quantity,
        harga_satuan,
      }, { transaction });

      // Deduct inventory stock
      await product.update({
        stok: product.stok - quantity,
      }, { transaction });
    }

    // Commit transaction
    await transaction.commit();

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        data: {
          order: newOrder,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('Checkout Error:', error);
    const isClientError = error.message.includes('not found') || error.message.includes('stock') || error.message.includes('items');
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: isClientError ? 400 : 500 }
    );
  }
}
