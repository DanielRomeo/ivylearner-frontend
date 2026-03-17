// app/api/auth/me/route.ts

import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {  // ← use NextRequest not Request
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    
    console.log('Auth header received:', authHeader); // ← add this to confirm
    
    if (!authHeader) {
        return NextResponse.json({ message: 'No authorization header' }, { status: 401 });
    }

    try {
        const response = await fetch(`${process.env.NEXT_PRIVATE_API_URL}/api/auth/me`, {
            headers: {
                Authorization: authHeader,
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Auth me route error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}