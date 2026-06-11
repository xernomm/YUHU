import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { bank_code, account_number } = body;

    if (!bank_code || !account_number) {
      return NextResponse.json(
        { error: 'Missing required fields: bank_code and account_number' },
        { status: 400 }
      );
    }

    const xenditSecretKey = process.env.XENDIT_SECRET_KEY;
    if (!xenditSecretKey) {
      return NextResponse.json(
        { error: 'Xendit API configuration is missing.' },
        { status: 500 }
      );
    }
    
    // Xendit uses Basic Auth where the secret key is the username, and password is empty
    const base64Auth = Buffer.from(`${xenditSecretKey}:`).toString('base64');

    const response = await fetch('https://api.xendit.co/bank_account_validations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64Auth}`
      },
      body: JSON.stringify({
        bank_code: bank_code,
        bank_account_number: account_number
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Xendit Validation Error:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to validate bank account with Xendit', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        message: 'Bank account validated successfully',
        account_holder_name: data.bank_account_holder_name || data.account_holder_name || null,
        bank_code: data.bank_code,
        account_number: data.bank_account_number || data.account_number,
        status: data.status || 'SUCCESS'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Validate Bank Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
