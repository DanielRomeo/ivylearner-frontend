// app/dashboard/page.tsx
'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import axios from 'axios';

// Components
import Sidebar from './_components/sidebar';
import CoursesList from './_components/coursesList';
import OrganizationsList from './_components/organisationList';
import Profile from './_components/profile';
import styles from '../_styles/dashboard/coursesList.module.scss';

// You might want to create an auth context or use your preferred auth solution
import { useAuth } from '../../contexts/auth-context'; // Create this context
import { getUserDetails } from '@/app/api/ID/StudentInstructor';

// Types
interface Instructor {
	id: number;
	firstName: string;
	lastName: string;
	profilePicture: string;
	bio: string;
	specialization: string;
}

interface Course {
	id: number;
	title: string;
	shortDescription: string;
	publishStatus: 'draft' | 'published' | 'archived';
	lastUpdated: Date;
}

interface Organization {
	id: number;
	name: string;
	logo: string;
}

export default function DashboardComponent() {
	const router = useRouter();
	const { user, isAuthenticated, getToken } = useAuth();
	const [instructor, setInstructor] = useState(null);
	const [activeView, setActiveView] = useState('courses');
	const [loading, setLoading] = useState(true);

	// Remove authChecked state and handle auth status differently
	const fetchInstructorData = useCallback(async () => {
		try {
			const token = await getToken();

			// If no token, wait and retry once
			if (!token) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				const retryToken = await getToken();
				if (!retryToken) {
					console.log('No token available after retry');
					router.push('/signin');
					return;
				}
			}

			// Ensure we have user ID
			if (!user?.id) {
				console.log('No user ID available');
				router.push('/signin');
				return;
			}

			const userDetailsId = await getUserDetails(user.id);

			const response = await axios.get('/api/instructors/getOne', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: {
					id: userDetailsId,
				},
			});

			if (response.status === 200) {
				setInstructor(response.data);
				setLoading(false);
			} else if (response.status === 404) {
				router.push('/onboarding');
			}
		} catch (error: any) {
			console.error('Error fetching instructor data:', error);
			if (error.response?.status === 401) {
				router.push('/signin');
			}
		}
	}, [user?.id, router, getToken]);

	// Single useEffect that watches auth state
	useEffect(() => {
		// Only proceed if we have a definitive auth state
		if (isAuthenticated === undefined) {
			return;
		}

		if (!isAuthenticated) {
			router.push('/signin');
			return;
		}

		// If authenticated, fetch instructor data
		fetchInstructorData();
	}, [isAuthenticated, fetchInstructorData, router]);

	if (loading || !instructor) {
		return (
			<Container className="d-flex align-items-center justify-content-center min-vh-100">
				<div className="text-center">
					<Spinner animation="border" role="status" variant="primary" />
					<p className="mt-3 text-muted">Loading your dashboard...</p>
				</div>
			</Container>
		);
	}

	// Error state

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className={styles.dashboard}
		>
			<Sidebar instructor={instructor} activeView={activeView} onViewChange={setActiveView} />

			<main className={styles.mainContent}>
				<Container fluid>
					<Row>
						<Col>
							{/* {activeView === 'courses' && <CoursesList instructorId={instructor.id} />}
              {activeView === 'organizations' && <OrganizationsList instructorId={instructor.id} />}
              {activeView === 'profile' && (
                <Profile 
                  instructor={instructor}
                  onUpdate={(updatedData) => setInstructor({ ...instructor, ...updatedData })}
                />
              )} */}
						</Col>
					</Row>
				</Container>
			</main>
		</motion.div>
	);
}
