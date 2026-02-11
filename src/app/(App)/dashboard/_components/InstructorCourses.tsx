'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Row, Col, Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    FaUsers, 
    FaStar,
    FaDollarSign,
    FaEye,
    FaSearch,
    FaChartLine,
    FaClock
} from 'react-icons/fa';
import styles from '../_styles/InstructorCourses.module.scss';

interface InstructorCoursesProps {
    sidebarOpen?: boolean;
    isMobile?: boolean;
}

const InstructorCourses = ({ sidebarOpen, isMobile }: InstructorCoursesProps) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    

    // Mock data - replace with API call later
    const courses = [
        {
            id: 1,
            title: 'React Masterclass 2024',
            thumbnail: 'https://images.pexels.com/photos/35709465/pexels-photo-35709465.jpeg?_gl=1*3ocp4y*_ga*NDA3NTYyMDQxLjE3Njc4OTg1NjY.*_ga_8JE65Q40S6*czE3NzAyNDI5MzIkbzIkZzEkdDE3NzAyNDI5NTYkajM2JGwwJGgw',
            students: 145,
            rating: 4.8,
            reviews: 89,
            revenue: 7450,
            status: 'published',
            category: 'Web Development',
            lastUpdated: '2024-01-15',
            duration: '12 hours'
        },
        {
            id: 2,
            title: 'Advanced TypeScript',
            thumbnail: 'https://images.pexels.com/photos/35709465/pexels-photo-35709465.jpeg?_gl=1*3ocp4y*_ga*NDA3NTYyMDQxLjE3Njc4OTg1NjY.*_ga_8JE65Q40S6*czE3NzAyNDI5MzIkbzIkZzEkdDE3NzAyNDI5NTYkajM2JGwwJGgw',
            students: 98,
            rating: 4.9,
            reviews: 62,
            revenue: 4900,
            status: 'published',
            category: 'Programming',
            lastUpdated: '2024-01-10',
            duration: '8 hours'
        },
        {
            id: 3,
            title: 'Node.js Backend Development',
            thumbnail: 'https://images.pexels.com/photos/35709465/pexels-photo-35709465.jpeg?_gl=1*3ocp4y*_ga*NDA3NTYyMDQxLjE3Njc4OTg1NjY.*_ga_8JE65Q40S6*czE3NzAyNDI5MzIkbzIkZzEkdDE3NzAyNDI5NTYkajM2JGwwJGgw',
            students: 99,
            rating: 4.7,
            reviews: 54,
            revenue: 3270,
            status: 'published',
            category: 'Backend',
            lastUpdated: '2024-01-05',
            duration: '10 hours'
        },
        {
            id: 4,
            title: 'Python for Data Science',
            thumbnail: 'https://images.pexels.com/photos/35709465/pexels-photo-35709465.jpeg?_gl=1*3ocp4y*_ga*NDA3NTYyMDQxLjE3Njc4OTg1NjY.*_ga_8JE65Q40S6*czE3NzAyNDI5MzIkbzIkZzEkdDE3NzAyNDI5NTYkajM2JGwwJGgw',
            students: 0,
            rating: 0,
            reviews: 0,
            revenue: 0,
            status: 'draft',
            category: 'Data Science',
            lastUpdated: '2024-01-20',
            duration: '15 hours'
        }
    ];

    const handleCreateNew = () => {
        router.push('/dashboard/instructor/create-course');
    };


    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
    const totalRevenue = courses.reduce((sum, course) => sum + course.revenue, 0);
    const avgRating = courses.reduce((sum, course) => sum + course.rating, 0) / courses.filter(c => c.rating > 0).length;

    return (
        <div className={`${styles.coursesPage} ${sidebarOpen && !isMobile ? styles.sidebarOpen : styles.sidebarClosed}`}>
            <div className={styles.header}>
                <div>
                    <h1>My Courses</h1>
                    <p>Manage and track your course performance</p>
                </div>
                <Button variant="primary" onClick={handleCreateNew} className={styles.createBtn}>
                    <FaPlus /> Create New Course
                </Button>
               
            </div>

            {/* Stats Overview */}
            <Row className="g-4 mb-4">
                <Col md={3}>
                    <Card className={styles.statCard}>
                        <Card.Body>
                            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #00bf63 0%, #24570f 100%)' }}>
                                <FaUsers />
                            </div>
                            <div className={styles.statContent}>
                                <h3>{totalStudents}</h3>
                                <p>Total Students</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className={styles.statCard}>
                        <Card.Body>
                            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #5271ff 0%, #3451e6 100%)' }}>
                                <FaDollarSign />
                            </div>
                            <div className={styles.statContent}>
                                <h3>${totalRevenue.toLocaleString()}</h3>
                                <p>Total Revenue</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className={styles.statCard}>
                        <Card.Body>
                            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f9c80e 0%, #d4a807 100%)' }}>
                                <FaStar />
                            </div>
                            <div className={styles.statContent}>
                                <h3>{avgRating.toFixed(1)}</h3>
                                <p>Average Rating</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className={styles.statCard}>
                        <Card.Body>
                            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #b9e185 0%, #8cc152 100%)' }}>
                                <FaChartLine />
                            </div>
                            <div className={styles.statContent}>
                                <h3>{courses.length}</h3>
                                <p>Total Courses</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filters and Search */}
            <Card className={styles.filterCard}>
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={6}>
                            <div className={styles.filterBtns}>
                                <Button 
                                    variant={filterStatus === 'all' ? 'primary' : 'outline-secondary'}
                                    onClick={() => setFilterStatus('all')}
                                    className={styles.filterBtn}
                                >
                                    All
                                </Button>
                                <Button 
                                    variant={filterStatus === 'published' ? 'primary' : 'outline-secondary'}
                                    onClick={() => setFilterStatus('published')}
                                    className={styles.filterBtn}
                                >
                                    Published
                                </Button>
                                <Button 
                                    variant={filterStatus === 'draft' ? 'primary' : 'outline-secondary'}
                                    onClick={() => setFilterStatus('draft')}
                                    className={styles.filterBtn}
                                >
                                    Drafts
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Courses Grid */}
            <Row className="g-4">
                {filteredCourses.map((course) => (
                    <Col key={course.id} md={6} lg={4}>
                        <Card className={styles.courseCard}>
                            <div className={styles.thumbnailContainer}>
                                <img 
                                    src={course.thumbnail} 
                                    alt={course.title}
                                    className={styles.thumbnail}
                                />
                                <Badge 
                                    className={`${styles.statusBadge} ${styles[course.status]}`}
                                >
                                    {course.status}
                                </Badge>
                            </div>
                            <Card.Body>
                                <div className={styles.courseHeader}>
                                    <Badge className={styles.categoryBadge}>
                                        {course.category}
                                    </Badge>
                                    <span className={styles.duration}>
                                        <FaClock /> {course.duration}
                                    </span>
                                </div>
                                
                                <h3 className={styles.courseTitle}>{course.title}</h3>
                                
                                <div className={styles.courseStats}>
                                    <div className={styles.statItem}>
                                        <FaUsers />
                                        <span>{course.students} students</span>
                                    </div>
                                    {course.rating > 0 && (
                                        <div className={styles.statItem}>
                                            <FaStar />
                                            <span>{course.rating} ({course.reviews})</span>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.revenue}>
                                    <FaDollarSign />
                                    <span>${course.revenue.toLocaleString()}</span>
                                </div>

                                <div className={styles.lastUpdated}>
                                    Last updated: {new Date(course.lastUpdated).toLocaleDateString()}
                                </div>

                                <div className={styles.actions}>
                                    <Button className={styles.editBtn}>
                                        <FaEdit /> Edit
                                    </Button>
                                    <Button className={styles.viewBtn}>
                                        <FaEye /> View
                                    </Button>
                                    <Button className={styles.deleteBtn}>
                                        <FaTrash />
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {filteredCourses.length === 0 && (
                <div className={styles.noCourses}>
                    <h3>No courses found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default InstructorCourses;