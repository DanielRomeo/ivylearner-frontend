'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { FaPlay, FaClock, FaUsers, FaStar, FaLock, FaUnlock, FaChalkboardTeacher, FaCheckCircle } from 'react-icons/fa';
import styles from '../../_styles/course/courseComponent.module.scss';
import ModernNavbar from '../../_components/MainNavbar';

const CourseDetailPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [instructors, setInstructors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);

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

            // console.log('Course response status:', courseRes);
            
            if (!courseRes.ok) throw new Error('Failed to fetch course');
            const courseData = await courseRes.json();
            console.log('Course data:', courseData);
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
                try {
                    const enrollmentRes = await fetch('/api/enrollments/my-enrollments', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    if (enrollmentRes.ok) {
                        const enrollmentData = await enrollmentRes.json();
                        const enrollments = enrollmentData.data || enrollmentData || [];
                        const enrolled = enrollments.some((e: any) => 
                            e.courseId === parseInt(id as string) || e.courseId === id
                        );
                        setIsEnrolled(enrolled);
                    }
                } catch (err) {
                    console.error('Error checking enrollment:', err);
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

        // If already enrolled, go to first lesson
        if (isEnrolled) {
            const firstLesson = lessons.find(l => l.orderIndex === 1 || l.order === 1) || lessons[0];
            if (firstLesson) {
                router.push(`/lesson/${firstLesson.id}`);
            }
            return;
        }

        // For free courses (R0), enroll directly
        if (course?.price === 0 || !course?.price) {
            setEnrolling(true);
            try {
                const response = await fetch('/api/enrollments', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        courseId: parseInt(id as string)
                    })
                });

                if (response.ok) {
                    setIsEnrolled(true);
                    alert('Successfully enrolled! 🎉');
                    // Refresh to update UI
                    fetchCourseData();
                } else {
                    const errorData = await response.json();
                    alert('Enrollment failed: ' + (errorData.error || 'Unknown error'));
                }
            } catch (err: any) {
                console.error('Enrollment error:', err);
                alert('Failed to enroll: ' + err.message);
            } finally {
                setEnrolling(false);
            }
        } else {
            // For paid courses, go to checkout
            router.push(`/checkout/${id}`);
        }
    };

    const handleLessonClick = (lessonId: number, isFreePreview: boolean) => {
        const token = localStorage.getItem('access_token');
        
        // Free preview lessons - anyone can access
        if (isFreePreview) {
            router.push(`/lesson/${lessonId}`);
            return;
        }

        // Must be logged in
        if (!token) {
            alert('Please log in to access this lesson');
            router.push('/login');
            return;
        }

        // Must be enrolled
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
                <Button onClick={() => router.push('/courses')}>Back to Courses</Button>
            </Container>
        );
    }

    const totalDuration = lessons.reduce((sum, lesson) => sum + (lesson.durationMinutes || 0), 0);
    const freePreviewCount = lessons.filter(l => l.isFreePreview).length;

    return (
        <div className={styles.courseDetailPage}>
            <ModernNavbar />
            {/* Hero Section */}
            <div className={styles.heroSection}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={7}>
                            <Badge bg="success" className={styles.categoryBadge}>
                                {course?.category || 'Course'}
                            </Badge>
                            {isEnrolled && (
                                <Badge bg="primary" className="ms-2">
                                    <FaCheckCircle /> Enrolled
                                </Badge>
                            )}
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
                                        {course?.price === 0 || !course?.price ? (
                                            <h2 className={styles.price}>Free</h2>
                                        ) : (
                                            <>
                                                <h2 className={styles.price}>R{course?.price}</h2>
                                                <span className={styles.originalPrice}>R{(course?.price * 1.5).toFixed(2)}</span>
                                            </>
                                        )}
                                    </div>
                                    <Button 
                                        variant={isEnrolled ? "outline-success" : "success"} 
                                        size="lg" 
                                        className={styles.enrollBtn}
                                        onClick={handleEnroll}
                                        disabled={enrolling}
                                    >
                                        {enrolling ? (
                                            <>
                                                <Spinner size="sm" animation="border" /> Enrolling...
                                            </>
                                        ) : isEnrolled ? (
                                            <>
                                                <FaCheckCircle /> Already Enrolled - Continue Learning
                                            </>
                                        ) : course?.price === 0 || !course?.price ? (
                                            'Enroll for Free'
                                        ) : (
                                            'Buy Now'
                                        )}
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
                                                    {lesson.isFreePreview || isEnrolled ? (
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
                                                    {isEnrolled && !lesson.isFreePreview && (
                                                        <Badge bg="primary" className={styles.previewBadge}>
                                                            Unlocked
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