'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Card, Badge, ProgressBar, Button } from 'react-bootstrap';
import { FaBook, FaClock, FaPlay, FaCheckCircle } from 'react-icons/fa';
import styles from '../_styles/MyCourses.module.scss';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const MyCourses = () => {
	const [enrollments, setEnrollments] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
	const router = useRouter();

	useEffect(() => {
		fetchEnrollments();
	}, []);

	const fetchEnrollments = async () => {
		try {
			const response = await axios.get('/api/enrollments/my-enrollments');
			setEnrollments(response.data.data || []);
		} catch (error) {
			console.error('Error fetching enrollments:', error);
		} finally {
			setLoading(false);
		}
	};

	const filteredCourses = enrollments.filter((enrollment) => {
		if (filter === 'all') return true;
		if (filter === 'completed') return enrollment.completedAt;
		if (filter === 'in-progress') return !enrollment.completedAt;
		return true;
	});

	const getStatusBadge = (enrollment: any) => {
		if (enrollment.completedAt) {
			return <Badge bg="success">Completed</Badge>;
		} else if (enrollment.progressPercentage > 0) {
			return <Badge bg="primary">In Progress</Badge>;
		} else {
			return <Badge bg="secondary">Not Started</Badge>;
		}
	};

	if (loading) {
		return <div className={styles.loading}>Loading your courses...</div>;
	}

	return (
		<div className={styles.myCoursesPage}>
			<div className={styles.header}>
				<div>
					<h1>My Courses</h1>
					<p>Continue learning and track your progress</p>
				</div>

				<div className={styles.filterButtons}>
					<button
						className={filter === 'all' ? styles.active : ''}
						onClick={() => setFilter('all')}
					>
						All ({enrollments.length})
					</button>
					<button
						className={filter === 'in-progress' ? styles.active : ''}
						onClick={() => setFilter('in-progress')}
					>
						In Progress ({enrollments.filter((e) => !e.completedAt).length})
					</button>
					<button
						className={filter === 'completed' ? styles.active : ''}
						onClick={() => setFilter('completed')}
					>
						Completed ({enrollments.filter((e) => e.completedAt).length})
					</button>
				</div>
			</div>

			{filteredCourses.length > 0 ? (
				<Row className="g-4">
					{filteredCourses.map((enrollment, index) => (
						<Col key={index} lg={4} md={6}>
							<Card className={styles.courseCard}>
								<div className={styles.courseImage}>
									<img
										src={`https://via.placeholder.com/400x250?text=Course+${enrollment.courseId}`}
										alt="Course"
									/>
									<div className={styles.statusBadge}>
										{getStatusBadge(enrollment)}
									</div>
								</div>
								<Card.Body>
									<h5 className={styles.courseTitle}>
										Course #{enrollment.courseId}
									</h5>

									<div className={styles.courseStats}>
										<span>
											<FaClock /> 8 hours
										</span>
										<span>
											<FaBook /> 24 lessons
										</span>
									</div>

									<div className={styles.progressSection}>
										<div className={styles.progressHeader}>
											<span>Progress</span>
											<span className={styles.progressPercent}>
												{Math.round(enrollment.progressPercentage || 0)}%
											</span>
										</div>
										<ProgressBar
											now={enrollment.progressPercentage || 0}
											className={styles.progressBar}
										/>
									</div>

									<div className={styles.actions}>
										{enrollment.completedAt ? (
											<>
												<Button className={styles.certificateBtn}>
													<FaCheckCircle /> View Certificate
												</Button>
												<Button
													variant="outline-primary"
													className={styles.reviewBtn}
												>
													Review Again
												</Button>
											</>
										) : (
											<Button className={styles.continueBtn}>
												<FaPlay /> Continue Learning
											</Button>
										)}
									</div>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			) : (
				<Card className={styles.emptyState}>
					<Card.Body className="text-center py-5">
						<FaBook size={64} className="mb-3" style={{ color: '#00bf63' }} />
						<h3>No {filter !== 'all' && filter} courses found</h3>
						<p>
							{filter === 'all'
								? "You haven't enrolled in any courses yet"
								: `You don't have any ${filter} courses`}
						</p>
						<Button
							className={styles.browseBtn}
							onClick={() => router.push('/courses')}
						>
							Browse Courses
						</Button>
					</Card.Body>
				</Card>
			)}
		</div>
	);
};

export default MyCourses;
