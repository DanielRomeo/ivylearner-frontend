// app/dashboard/components/CoursesList.tsx
import { useState, useEffect } from 'react';
import { Card, Button, Badge, Col, Row, Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import styles from '../../_styles/dashboard/coursesList.module.scss';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Course {
	id: number;
	title: string;
	shortDescription: string;
	publishStatus: 'draft' | 'published' | 'archived';
	lastUpdated: Date;
}

interface CoursesListProps {
	instructorId: number;
}

export default function CoursesList({ instructorId }: CoursesListProps) {
	const [courses, setCourses] = useState<Course[]>([]);
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		try {
			const response = await axios.get(`/api/courses/mycourses`);
			setCourses(response.data.data);
			// console.log
		} catch (error) {
			console.error('Error fetching organization:', error);
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'published':
				return 'success';
			case 'draft':
				return 'warning';
			case 'archived':
				return 'secondary';
			default:
				return 'primary';
		}
	};

	// handle edit course: route to where they can edit the course:
	const handleEditCourse = (courseId: number) => {
		router.push(`/dashboard/editCourse?courseId=${courseId}`);
	};

	return (
		<>
			<Container className={styles.coursesList}>
				water
				<div className={styles.header}>
					<h2>My Courses</h2>
					<Button
						variant="primary"
						onClick={() => {
							router.push('/dashboard/createCourse');
						}}
					>
						Create New Course
					</Button>
				</div>
				<Row>
					{courses.map((course) => (
						<Col>
							<motion.div
								key={course.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								<Card className={styles.courseCard}>
									<Card.Body>
										<Card.Title>{course.title}</Card.Title>
										<Badge bg={getStatusColor(course.publishStatus)}>
											{course.publishStatus}
										</Badge>
										<Card.Text>{course.shortDescription}</Card.Text>
										<div className={styles.cardFooter}>
											<small>
												Last updated:{' '}
												{new Date(course.lastUpdated).toLocaleDateString()}
											</small>
											<br />
											<Button
												variant="outline-primary"
												size="sm"
												onClick={() => {
													handleEditCourse(course.id);
												}}
											>
												Edit
											</Button>
										</div>
									</Card.Body>
								</Card>
							</motion.div>
						</Col>
					))}
				</Row>
			</Container>
		</>
	);
}
