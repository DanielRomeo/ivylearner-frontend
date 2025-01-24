import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
	try {
		// Access the instructor ID from route params
		const instructorId = params.id;

		if (!instructorId) {
			return NextResponse.json({ error: 'Instructor ID is required' }, { status: 400 });
		}

		// Fetch the data from the private API
		const apiResponse = await fetch(
			`${process.env.NEXT_PRIVATE_API_URL}/api/organisations/first/${instructorId}`,
			{
				headers: {
					'Content-Type': 'application/json',
					// Add any necessary authorization headers
				},
			}
		);

		if (!apiResponse.ok) {
			const errorMessage = await apiResponse.text();
			return NextResponse.json(
				{ error: `Error fetching organisation: ${errorMessage}` },
				{ status: apiResponse.status }
			);
		}

		// Parse the response and send it back as JSON
		const data = await apiResponse.json();
		return NextResponse.json(data);
	} catch (error: any) {
		return NextResponse.json(
			{ error: 'Internal Server Error', details: error.message },
			{ status: 500 }
		);
	}
}
