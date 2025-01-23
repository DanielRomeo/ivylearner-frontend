// app/courses/[id]/page.tsx
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import OneCourseComponent from './courseComponent';

async function getCourse(id: string) {
	const headersList = headers();
	// Get JWT from Authorization header instead of cookies
	const token = headersList.get('authorization')?.split(' ')[1];

	if (!token) {
		redirect('/signin');
	}

	try {
		const response = await fetch(`http://localhost:5000/courses/${id}`, {
			// headers: {
			// 	Authorization: `Bearer ${token}`,
			// },
			// cache: 'no-store',
		});

		if (!response.ok) throw new Error('Failed to fetch course');

		return response.json();
	} catch (error) {
		throw new Error('Failed to fetch course');
	}
}

async function getCourseFake(id: string) {
	const headersList = headers();
	// Get JWT from Authorization header instead of cookies
	const token = headersList.get('authorization')?.split(' ')[1];

	try {
		const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: 'no-store',
		});

		if (!response.ok) throw new Error('Failed to fetch course');

		return response.json();
	} catch (error) {
		throw new Error('Failed to fetch course');
	}
}

export default async function Page({ params }: { params: { id: string } }) {
	// try {
	// 	const course = await getCourse(params.id);
	// 	return <OneCourseComponent course={course} />;
	// } catch (error) {
	// 	redirect('/not-found');
	// }

	// the above code is to be used if i want to force users to be authorized before they can view a course:
	// DONT DELETE THE CODE... we will use it for other parts of the application:
	try {
		const course = await getCourseFake(params.id);
		return <OneCourseComponent course={course} />;
	} catch (error) {
		redirect('/not-found');
	}
}
