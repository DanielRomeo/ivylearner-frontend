'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { FaPlay, FaClock, FaUsers, FaStar, FaLock, FaUnlock, FaChalkboardTeacher } from 'react-icons/fa';
// import styles from './_styles/CourseDetail.module.scss';
import styles from '../../_styles/course/courseComponent.module.scss';

const CourseDetailPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [instructors, setInstructors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');

            // Fetch course details
            const courseRes = await fetch(`/api/courses/${id}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });
            
            if (!courseRes.ok) throw new Error('Failed to fetch course');
            const courseData = await courseRes.json();
            setCourse(courseData.data || courseData);

            // Fetch lessons
            const lessonsRes = await fetch(`/api/lessons/course/${id}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });
            
            if (lessonsRes.ok) {
                const lessonsData = await lessonsRes.json();
                setLessons(lessonsData.data || lessonsData || []);
            }

            // Fetch instructors
            const instructorsRes = await fetch(`/api/courses/${id}/instructors`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });
            
            if (instructorsRes.ok) {
                const instructorsData = await instructorsRes.json();
                setInstructors(instructorsData.data || instructorsData || []);
            }

            // Check if user is enrolled (if logged in)
            if (token) {
                // You can add enrollment check here
                // const enrollmentRes = await fetch(`/api/enrollments/check/${id}`, {...});
            }
        } catch (err: any) {
            setError('Failed to load course: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/login');
            return;
        }
        // Handle enrollment logic
        router.push(`/checkout/${id}`);
    };

    const handleLessonClick = (lessonId: number, isFreePreview: boolean) => {
        if (isFreePreview) {
            router.push(`/lesson/${lessonId}`);
        } else if (isEnrolled) {
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
                <Button onClick={() => router.push('/courses')}>Back to Courses</Button>
            </Container>
        );
    }

    const totalDuration = lessons.reduce((sum, lesson) => sum + (lesson.durationMinutes || 0), 0);
    const freePreviewCount = lessons.filter(l => l.isFreePreview).length;

    return (
        <div className={styles.courseDetailPage}>
            {/* Hero Section */}
            <div className={styles.heroSection}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={7}>
                            <Badge bg="success" className={styles.categoryBadge}>
                                {course?.category || 'Course'}
                            </Badge>
                            <h1 className={styles.courseTitle}>{course?.title}</h1>
                            <p className={styles.courseDescription}>
                                {course?.shortDescription || course?.description}
                            </p>
                            
                            <div className={styles.courseMetaInfo}>
                                <div className={styles.metaItem}>
                                    <FaStar className={styles.icon} />
                                    <span>4.8 (1,234 reviews)</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <FaUsers className={styles.icon} />
                                    <span>3,456 students</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <FaClock className={styles.icon} />
                                    <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                                </div>
                            </div>

                            <div className={styles.instructorInfo}>
                                <FaChalkboardTeacher className={styles.icon} />
                                <span>Instructors: </span>
                                {instructors.map((inst, idx) => (
                                    <span key={inst.userId}>
                                        {inst.firstName} {inst.lastName}
                                        {idx < instructors.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </div>
                        </Col>
                        <Col lg={5}>
                            <Card className={styles.enrollCard}>
                                <div className={styles.thumbnailContainer}>
                                    {course?.thumbnailUrl ? (
                                        <img 
                                            src={course.thumbnailUrl} 
                                            alt={course.title}
                                            className={styles.thumbnail}
                                        />
                                    ) : (
                                        <div className={styles.placeholderThumbnail}>
                                            <FaPlay size={60} />
                                        </div>
                                    )}
                                </div>
                                <Card.Body>
                                    <div className={styles.priceSection}>
                                        <h2 className={styles.price}>
                                            ${course?.price || 0}
                                        </h2>
                                        {course?.price > 0 && (
                                            <span className={styles.originalPrice}>$199.99</span>
                                        )}
                                    </div>
                                    <Button 
                                        variant="success" 
                                        size="lg" 
                                        className={styles.enrollBtn}
                                        onClick={handleEnroll}
                                    >
                                        {isEnrolled ? 'Go to Course' : 'Enroll Now'}
                                    </Button>
                                    <div className={styles.includes}>
                                        <h6>This course includes:</h6>
                                        <ul>
                                            <li><FaClock /> {lessons.length} lessons</li>
                                            <li><FaUnlock /> {freePreviewCount} free previews</li>
                                            <li><FaClock /> {Math.floor(totalDuration / 60)} hours of video</li>
                                            <li>📱 Mobile and TV access</li>
                                            <li>🎓 Certificate of completion</li>
                                        </ul>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Course Content Section */}
            <Container className={styles.contentSection}>
                <Row>
                    <Col lg={8}>
                        <Card className={styles.contentCard}>
                            <Card.Body>
                                <h2 className={styles.sectionTitle}>What you'll learn</h2>
                                <div className={styles.learningObjectives}>
                                    <Row>
                                        <Col md={6}>
                                            <ul>
                                                <li>✅ Master the fundamentals</li>
                                                <li>✅ Build real-world projects</li>
                                                <li>✅ Advanced techniques</li>
                                            </ul>
                                        </Col>
                                        <Col md={6}>
                                            <ul>
                                                <li>✅ Industry best practices</li>
                                                <li>✅ Problem-solving skills</li>
                                                <li>✅ Career opportunities</li>
                                            </ul>
                                        </Col>
                                    </Row>
                                </div>

                                <h2 className={styles.sectionTitle}>Course Content</h2>
                                <p className={styles.contentSummary}>
                                    {lessons.length} lessons • {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total length
                                </p>
                                
                                <ListGroup className={styles.lessonsList}>
                                    {lessons.map((lesson, index) => (
                                        <ListGroup.Item 
                                            key={lesson.id} 
                                            className={styles.lessonItem}
                                            onClick={() => handleLessonClick(lesson.id, lesson.isFreePreview)}
                                            style={{ cursor: lesson.isFreePreview || isEnrolled ? 'pointer' : 'default' }}
                                        >
                                            <div className={styles.lessonInfo}>
                                                <div className={styles.lessonNumber}>
                                                    {lesson.isFreePreview ? (
                                                        <FaPlay className={styles.playIcon} />
                                                    ) : isEnrolled ? (
                                                        <FaPlay className={styles.playIcon} />
                                                    ) : (
                                                        <FaLock className={styles.lockIcon} />
                                                    )}
                                                    <span>{index + 1}.</span>
                                                </div>
                                                <div>
                                                    <h6>{lesson.title}</h6>
                                                    {lesson.isFreePreview && (
                                                        <Badge bg="success" className={styles.previewBadge}>
                                                            Free Preview
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={styles.lessonDuration}>
                                                <FaClock className={styles.clockIcon} />
                                                <span>{lesson.durationMinutes || 0} min</span>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>

                                <h2 className={styles.sectionTitle}>About this course</h2>
                                <p className={styles.aboutText}>
                                    {course?.description}
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <Card className={styles.sideCard}>
                            <Card.Body>
                                <h5>Instructors</h5>
                                {instructors.map(inst => (
                                    <div key={inst.userId} className={styles.instructorCard}>
                                        <div className={styles.instructorAvatar}>
                                            {inst.firstName[0]}{inst.lastName[0]}
                                        </div>
                                        <div>
                                            <h6>{inst.firstName} {inst.lastName}</h6>
                                            <p className={styles.instructorRole}>{inst.role === 'lead' ? 'Lead Instructor' : 'Assistant Instructor'}</p>
                                        </div>
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CourseDetailPage;