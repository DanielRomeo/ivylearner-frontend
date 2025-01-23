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

// Styles
import styles from '../_styles/dashboard/coursesList.module.scss';

// Contexts and API
import { useAuth } from '../../contexts/auth-context';
import { getUserDetails } from '@/app/api/ID/StudentInstructor';
import MainNavbar from '../_components/MainNavbar';

// Types
interface Instructor {
	id: number;
	firstName: string;
	lastName: string;
	profilePicture: string;
	bio: string;
	specialization: string;
}

export default function DashboardPage() {
	const router = useRouter();
	const { user, isAuthenticated, getToken } = useAuth();

	const [instructor, setInstructor] = useState<Instructor | null>(null);
	const [activeView, setActiveView] = useState<'courses' | 'organizations' | 'profile'>(
		'courses'
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchInstructorData = useCallback(async () => {
		if (!user?.id) {
			router.push('/signin');
			return;
		}

		try {
			const token = await getToken();
			if (!token) {
				router.push('/signin');
				return;
			}

			const userDetailsId = await getUserDetails(user.id);
			const response = await axios.get('/api/instructors/getOne', {
				headers: { Authorization: `Bearer ${token}` },
				params: { id: userDetailsId },
			});

			if (response.status === 200) {
				setInstructor(response.data);
				setLoading(false);
			} else if (response.status === 404) {
				router.push('/onboarding');
			}
		} catch (error: any) {
			console.error('Error fetching instructor data:', error);
			setError('Failed to load instructor data');
			setLoading(false);

			if (error.response?.status === 401) {
				router.push('/signin');
			}
		}
	}, [user?.id, router, getToken]);

	useEffect(() => {
		if (isAuthenticated === false) {
			router.push('/signin');
			return;
		}

		if (isAuthenticated === true) {
			fetchInstructorData();
		}
	}, [isAuthenticated, fetchInstructorData, router]);

	if (loading) {
		return (
			<Container className="d-flex align-items-center justify-content-center min-vh-100">
				<div className="text-center">
					<Spinner animation="border" role="status" variant="primary" />
					<p className="mt-3 text-muted">Loading your dashboard...</p>
				</div>
			</Container>
		);
	}

	if (error) {
		return (
			<Container className="d-flex align-items-center justify-content-center min-vh-100">
				<div className="text-center text-danger">
					<p>{error}</p>
					{/* <button onClick={() => router.reload()}>Retry</button> */}
				</div>
			</Container>
		);
	}

	if (!instructor) {
		router.push('/onboarding');
		return null;
	}

	return (
		<>
			<MainNavbar></MainNavbar>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				className={styles.dashboard}
			>
				<Sidebar
					instructor={instructor}
					activeView={activeView}
					onViewChange={setActiveView}
				>
					<Container fluid>
						<Row>
							<Col>
								{activeView === 'courses' && (
									<CoursesList instructorId={instructor.id} />
								)}
								{/* {activeView === 'organizations' && (
                                    <OrganizationsList instructorId={instructor.id} />
                                )} */}
								{activeView === 'profile' && (
									<Profile
										instructor={instructor}
										onUpdate={(updatedData) =>
											setInstructor((prev) =>
												prev ? { ...prev, ...updatedData } : null
											)
										}
									/>
								)}
							</Col>
						</Row>
					</Container>
				</Sidebar>
			</motion.div>
		</>
	);
}
