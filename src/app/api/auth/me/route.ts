// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
        return NextResponse.json({ message: 'No authorization header' }, { status: 401 });
    }

    try {
        // FIX: backend me endpoint is GET /users/me, not GET /auth/me
        const response = await fetch(`${process.env.NEXT_PRIVATE_API_URL}/api/auth/me`, {
            headers: {
                Authorization: authHeader,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Auth me route error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}