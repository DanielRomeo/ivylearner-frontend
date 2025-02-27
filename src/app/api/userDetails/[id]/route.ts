// src/app/api/userDetails/[id]/route.ts
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
	try {
		console.log('Reached userDetails API route with ID:', params.id);

		// Use the id from the path parameters:
		const userId = params.id;

		if (!userId) {
			return NextResponse.json({ error: 'userId is required' }, { status: 400 });
		}

		// Forward the request to your backend on port 5000
		const response = await axios.get(
			`${process.env.NEXT_PRIVATE_API_URL}/api/getUserDetails/${userId}`
		);

		// Return the data from your backend
		return NextResponse.json(response.data);
	} catch (err: any) {
		console.log('Error fetching user data:', err.message);

		// Return appropriate error status and message
		if (err.response) {
			return NextResponse.json(
				{ error: err.response.data?.error || 'Error fetching user data' },
				{ status: err.response.status }
			);
		}

		return NextResponse.json({ error: 'Failed to connect to backend' }, { status: 500 });
	}
}
