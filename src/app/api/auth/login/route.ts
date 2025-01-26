// app/api/courses/mycourses/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const body = await request.json();

	const response = await fetch(`${process.env.NEXT_PRIVATE_API_URL}/api/users/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	const data = await response.json();
	return NextResponse.json(data);
}
