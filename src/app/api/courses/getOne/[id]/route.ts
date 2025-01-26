import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
	try {
		// Access the instructor ID from route params
		const courseId = params.id;

		// Get the `Authorization` header from the incoming request
		const authHeader = request.headers.get('Authorization');

		// Extract the instructor ID from the query string if needed
		const url = new URL(request.url);

		if (!courseId) {
			return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
		}

		// Fetch the data from the private API
		const apiResponse = await fetch(
			`${process.env.NEXT_PRIVATE_API_URL}/api/courses/${courseId}`,
			{
				headers: {
					Authorization: authHeader || '',
				},
			}
		);

		if (!apiResponse.ok) {
			const errorMessage = await apiResponse.text();
			return NextResponse.json(
				{ error: `Error fetching course: ${errorMessage}` },
				{ status: apiResponse.status }
			);
		}

		// Parse the response and send it back as JSON
		const data = await apiResponse.json();
		return NextResponse.json(data);
	} catch (error: any) {
		// Handle unexpected errors
		return NextResponse.json(
			{ error: 'Internal Server Error', details: error.message },
			{ status: 500 }
		);
	}
}
