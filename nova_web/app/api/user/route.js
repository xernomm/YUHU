import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { User, UserDetail } from '@/lib/models/index.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    const whereClause = {};

    // Filter by role if specified
    if (role) {
      whereClause.role = role;
    }

    // Search query matches name, username, email, or phone
    if (search) {
      whereClause[Op.or] = [
        { nama: { [Op.like]: `%${search}%` } },
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { no_telp: { [Op.like]: `%${search}%` } },
      ];
    }

    // Find and count all matches
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: UserDetail,
          as: 'userDetail',
        },
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password', 'reset_token', 'reset_token_expiry'] },
    });

    return NextResponse.json(
      {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        limit,
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get Users List Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
