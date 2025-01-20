// app/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

// Components
import Sidebar from './_components/sidebar';
import CoursesList from './_components/coursesList';
import OrganizationsList from './_components/organisationList';
import Profile from './_components/profile';
import styles from '../_styles/dashboard/coursesList.module.scss';

// You might want to create an auth context or use your preferred auth solution
import { useAuth } from '../../contexts/auth-context'; // Create this context

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
	const { user, isAuthenticated, getToken } = useAuth(); // Get auth info from context
	const [instructor, setInstructor] = useState<Instructor | null>(null);
	const [activeView, setActiveView] = useState<'courses' | 'organizations' | 'profile'>(
		'courses'
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check authentication first
		if (!isAuthenticated) {
			router.push('/signin');
			return;
		}

		const fetchInstructorData = async () => {
			try {
			  setLoading(true);
			  const token = await getToken();
	  
			  if (!token || !user?.id) {
				throw new Error('Authentication required');
			  }
	  
			  const response = await fetch(`/api/users/${user.id}`, {
				headers: {
				  Authorization: `Bearer ${token}`,
				},
			  });
	  
			  if (!response.ok) {
				if (response.status === 404) {
				  router.push('/onboarding');
				  return;
				}
				throw new Error('Failed to fetch instructor data');
			  }
	  
			  const data = await response.json();
			  setInstructor(data);
			} catch (error) {
			  console.error('Error fetching instructor data:', error);
			//   setError(error instanceof Error ? error.message : 'An error occurred');
			  router.push('/signin');
			} finally {
			  setLoading(false);
			}
		  };
	  
		  fetchInstructorData();
		}, [isAuthenticated, user?.id, router, getToken]);

	if (loading) {
		return <div className={styles.loading}>Loading...</div>;
	}

	if (!instructor) {
		return null;
	}

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
