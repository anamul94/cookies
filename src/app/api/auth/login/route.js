import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Here you would typically:
    // 1. Validate credentials against database
    // 2. Generate JWT token
    
    // Mock token for demonstration
    const token = 'mock_jwt_token';

    // Set the token in cookies
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    });

    return NextResponse.json(
      { message: 'Login successful', token },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Login failed' },
      { status: 401 }
    );
  }
} 