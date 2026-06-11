import { NextResponse } from 'next/server';
import { User, UserDetail } from '@/lib/models/index.js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: UserDetail,
          as: 'userDetail',
        },
        {
          model: User,
          as: 'sponsor',
          attributes: ['id', 'username', 'nama', 'email', 'role', 'referral_code'],
        },
        {
          model: User,
          as: 'sponsoredUsers',
          attributes: ['id', 'username', 'nama', 'email', 'role', 'created_at'],
        }
      ],
      attributes: { exclude: ['password', 'reset_token', 'reset_token_expiry'] },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Get User Details Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
