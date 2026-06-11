import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { User } from '@/lib/models/index.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // 1. Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Security best practice: return generic message to prevent account enumeration
      return NextResponse.json(
        { message: 'If the email exists in our system, a reset link/OTP has been sent.' },
        { status: 200 }
      );
    }

    // 2. Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiryTime = new Date(Date.now() + 3600000); // 1 hour from now

    // 3. Save to User record
    await user.update({
      reset_token: resetToken,
      reset_token_expiry: expiryTime
    });

    // 4. Simulate sending email
    console.log('--- SIMULATING EMAIL SENDING ---');
    console.log(`To: ${email}`);
    console.log(`Subject: Password Reset Request`);
    console.log(`Content: Use the following token to reset your password: ${resetToken}`);
    console.log(`Expires: ${expiryTime.toISOString()}`);
    console.log('--------------------------------');

    return NextResponse.json(
      { message: 'If the email exists in our system, a reset link/OTP has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
