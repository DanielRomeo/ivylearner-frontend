'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
	Container,
	Row,
	Col,
	Card,
	Button,
	Badge,
	ListGroup,
	Spinner,
	Alert,
} from 'react-bootstrap';
import {
	FaPlay,
	FaClock,
	FaUsers,
	FaStar,
	FaLock,
	FaUnlock,
	FaChalkboardTeacher,
	FaCheckCircle,
} from 'react-icons/fa';
import styles from '../../_styles/course/courseComponent.module.scss';
import ModernNavbar from '../../_components/MainNavbar';

const CourseDetailPage = () => {
	const { slug } = useParams();
	const router = useRouter();

	const [course, setCourse] = useState<any>(null);
	const [lessons, setLessons] = useState<any[]>([]);
	const [instructors, setInstructors] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isEnrolled, setIsEnrolled] = useState(false);
	const [enrolling, setEnrolling] = useState(false);

	useEffect(() => {
		if (slug) {
			fetchCourseData();
		}
	}, [slug]);

	const fetchCourseData = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem('access_token');

			// 1️⃣ Fetch course by slug
			const courseRes = await fetch(`/api/courses/slug/${slug}`, {
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			});

			if (!courseRes.ok) throw new Error('Failed to fetch course');

			const courseData = await courseRes.json();
			const courseObj = courseData.data || courseData;

			setCourse(courseObj);

			const courseId = courseObj.id;

			// 2️⃣ Fetch lessons by course ID
			const lessonsRes = await fetch(`/api/lessons/course/${courseId}`, {
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			});

			if (lessonsRes.ok) {
				const lessonsData = await lessonsRes.json();
				setLessons(lessonsData.data || lessonsData || []);
			}

			// 3️⃣ Fetch instructors by course ID
			const instructorsRes = await fetch(`/api/courses/${courseId}/instructors`, {
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			});

			if (instructorsRes.ok) {
				const instructorsData = await instructorsRes.json();
				setInstructors(instructorsData.data || instructorsData || []);
			}

			// 4️⃣ Check enrollment
			if (token) {
				const enrollmentRes = await fetch('/api/enrollments/my-enrollments', {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (enrollmentRes.ok) {
					const enrollmentData = await enrollmentRes.json();
					const enrollments = enrollmentData.data || enrollmentData || [];

					const enrolled = enrollments.some(
						(e: any) => e.courseId === courseId
					);

					setIsEnrolled(enrolled);
				}
			}
		} catch (err: any) {
			setError('Failed to load course: ' + err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleEnroll = async () => {
		const token = localStorage.getItem('access_token');

		if (!token) {
			router.push('/login');
			return;
		}

		const courseId = course?.id;

		if (!courseId) return;

		// Already enrolled → go to first lesson
		if (isEnrolled) {
			const firstLesson =
				lessons.find((l) => l.orderIndex === 1 || l.order === 1) ||
				lessons[0];

			if (firstLesson) {
				router.push(`/lesson/${firstLesson.id}`);
			}
			return;
		}

		// Free course
		if (course?.price === 0 || !course?.price) {
			setEnrolling(true);

			try {
				const response = await fetch('/api/enrollments', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						courseId: courseId,
					}),
				});

				if (response.ok) {
					setIsEnrolled(true);
					fetchCourseData();
				} else {
					const errorData = await response.json();
					alert(
						'Enrollment failed: ' +
							(errorData.error || 'Unknown error')
					);
				}
			} catch (err: any) {
				alert('Failed to enroll: ' + err.message);
			} finally {
				setEnrolling(false);
			}
		} else {
			router.push(`/checkout/${courseId}`);
		}
	};

	const handleLessonClick = (lessonId: number, isFreePreview: boolean) => {
		const token = localStorage.getItem('access_token');

		if (isFreePreview) {
			router.push(`/lesson/${lessonId}`);
			return;
		}

		if (!token) {
			router.push('/login');
			return;
		}

		if (isEnrolled) {
			router.push(`/lesson/${lessonId}`);
		} else {
			alert('Please enroll in this course to access this lesson');
		}
	};

	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<Spinner animation="border" variant="success" />
				<p>Loading course...</p>
			</div>
		);
	}

	if (error) {
		return (
			<Container className="mt-5">
				<Alert variant="danger">{error}</Alert>
				<Button onClick={() => router.push('/courses')}>
					Back to Courses
				</Button>
			</Container>
		);
	}

	const totalDuration = lessons.reduce(
		(sum, lesson) => sum + (lesson.durationMinutes || 0),
		0
	);
	const freePreviewCount = lessons.filter(
		(l) => l.isFreePreview
	).length;

	return (
		<div className={styles.courseDetailPage}>
			<ModernNavbar />

			<div className={styles.heroSection}>
				<Container>
					<Row>
						<Col lg={7}>
							<Badge bg="success">
								{course?.category || 'Course'}
							</Badge>

							{isEnrolled && (
								<Badge bg="primary" className="ms-2">
									<FaCheckCircle /> Enrolled
								</Badge>
							)}

							<h1>{course?.title}</h1>
							<p>
								{course?.shortDescription ||
									course?.description}
							</p>

							<div>
								<FaUsers /> 3,456 students
								<FaClock className="ms-3" />{' '}
								{Math.floor(totalDuration / 60)}h{' '}
								{totalDuration % 60}m
							</div>
						</Col>

						<Col lg={5}>
							<Card>
								{course?.thumbnailUrl && (
									<img
										src={course.thumbnailUrl}
										alt={course.title}
									/>
								)}

								<Card.Body>
									<h2>
										{course?.price === 0 ||
										!course?.price
											? 'Free'
											: `R${course?.price}`}
									</h2>

									<Button
										onClick={handleEnroll}
										disabled={enrolling}
										variant={
											isEnrolled
												? 'outline-success'
												: 'success'
										}
									>
										{isEnrolled
											? 'Continue Learning'
											: course?.price === 0 ||
											  !course?.price
											? 'Enroll for Free'
											: 'Buy Now'}
									</Button>

									<div className="mt-3">
										<p>
											{lessons.length} lessons
										</p>
										<p>
											{freePreviewCount} free
											previews
										</p>
									</div>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Container>
			</div>
		</div>
	);
};

export default CourseDetailPage;