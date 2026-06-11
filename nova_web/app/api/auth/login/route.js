import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { User } from '@/lib/models/index.js';
import { signToken } from '@/lib/jwt.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    const loginIdentifier = email || username;

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: email/username and password are required' },
        { status: 400 }
      );
    }

    // 1. Find user by email or username
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: loginIdentifier },
          { username: loginIdentifier }
        ]
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 2. Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 3. Generate JWT
    const token = await signToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    // 4. Set HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    const userResponse = {
      id: user.id,
      username: user.username,
      nama: user.nama,
      email: user.email,
      no_telp: user.no_telp,
      role: user.role,
      referral_code: user.referral_code,
      sponsor_id: user.sponsor_id,
    };

    return NextResponse.json(
      { message: 'Login successful', user: userResponse, token },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
