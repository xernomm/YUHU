import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { User, Wallet, sequelize } from '@/lib/models/index.js';
import { signToken } from '@/lib/jwt.js';

export async function POST(request) {
  let transaction;
  try {
    const body = await request.json();
    const { username, password, nama, email, no_telp, referral_code } = body;

    // 1. Basic validation
    if (!username || !password || !nama || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: username, password, nama, email are required' },
        { status: 400 }
      );
    }

    // 2. Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or Email is already registered' },
        { status: 409 }
      );
    }

    // Begin database transaction
    transaction = await sequelize.transaction();

    // 3. Resolve sponsor by referral code and get sponsor's path
    let sponsorId = null;
    let sponsorPath = '';
    if (referral_code) {
      const sponsor = await User.findOne({ 
        where: { referral_code },
        transaction 
      });
      if (!sponsor) {
        throw new Error('Invalid referral code');
      }
      sponsorId = sponsor.id;
      sponsorPath = sponsor.path || sponsor.id;
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Generate a unique referral code and UUID for the new user
    const myReferralCode = 'REF' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const newUserId = crypto.randomUUID();
    const myPath = sponsorPath ? `${sponsorPath}/${newUserId}` : newUserId;

    // 6. Create User record inside the transaction
    const newUser = await User.create({
      id: newUserId,
      username,
      password: hashedPassword,
      nama,
      email,
      no_telp: no_telp || null,
      role: 'member',
      referral_code: myReferralCode,
      sponsor_id: sponsorId,
      path: myPath,
    }, { transaction });

    // 7. Create Wallet for the user inside the transaction
    await Wallet.create({
      user_id: newUserId,
      balance: 0.00,
      locked_balance: 0.00,
    }, { transaction });

    // Commit transaction
    await transaction.commit();

    // 8. Generate JWT
    const token = await signToken({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });

    // 9. Set HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Strip password from the returned object
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      nama: newUser.nama,
      email: newUser.email,
      no_telp: newUser.no_telp,
      role: newUser.role,
      referral_code: newUser.referral_code,
      sponsor_id: newUser.sponsor_id,
      path: newUser.path,
    };

    return NextResponse.json(
      { message: 'User registered successfully', user: userResponse, token },
      { status: 201 }
    );
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('Registration Error:', error);
    const isClientError = error.message.includes('referral code');
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: isClientError ? 400 : 500 }
    );
  }
}
