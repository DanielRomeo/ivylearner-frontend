'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Row, Col, Card, Button, Badge, Form, InputGroup, Alert } from 'react-bootstrap';
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
	FaClock,
} from 'react-icons/fa';
import styles from '../_styles/InstructorCourses.module.scss';
import axios from 'axios';

interface InstructorCoursesProps {
	sidebarOpen?: boolean;
	isMobile?: boolean;
}

const InstructorCourses = ({ sidebarOpen, isMobile }: InstructorCoursesProps) => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	const [courses, setCourses] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem('access_token');

			const response = await fetch('/api/courses/mycourses', {
				headers: {
					Authorization: `Bearer ${token || ''}`,
				},
			});
			if (response.ok) {
				// console.log('Courses fetched successfully');
				// console.log('Response:', response);
				const data = await response.json();
				// console.log('Data:', data);
				setCourses(data.data || []);
			} else {
				throw new Error('Failed to fetch courses');
			}
		} catch (err) {
			setLoading(false);
			console.error('Error fetching courses:', err);
			setError('Failed to load courses');
		}
	};

	const handleCreateNew = () => {
		router.push('/dashboard/instructor/create-course');
	};

	const handleDelete = async (id: number) => {
		if (confirm('Are you sure you want to delete this course?')) {
			try {
				await axios.delete(`/api/courses/${id}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});
				setCourses(courses.filter((course) => course.id !== id));
			} catch (err: any) {
				console.error('Error deleting course:', err);
				if (err.response?.status === 403) {
					alert(
						'You do not have permission to delete this course. Only the organization owner can delete courses.'
					);
				} else {
					alert('Failed to delete course');
				}
			}
		}
	};

	const filteredCourses = courses.filter((course) => {
		const matchesSearch =
			course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(course.category || '').toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
		return matchesSearch && matchesFilter;
	});

	const totalStudents = courses.reduce((sum, course) => sum + (course.students || 0), 0);
	// const totalRevenue = courses.reduce((sum, course) => sum + (course.revenue || 0), 0);
	const avgRating =
		courses.reduce((sum, course) => sum + (course.rating || 0), 0) /
			courses.filter((c) => c.rating > 0).length || 0;

	return (
		<div
			className={`${styles.coursesPage} ${sidebarOpen && !isMobile ? styles.sidebarOpen : styles.sidebarClosed}`}
		>
			<div className={styles.header}>
				<div>
					<h1>My Courses</h1>
					<p>Manage and track your course performance</p>
				</div>
				<Button variant="primary" onClick={handleCreateNew} className={styles.createBtn}>
					<FaPlus /> Create New Course
				</Button>
			</div>

			{error && <Alert variant="danger">{error}</Alert>}

			{/* Stats Overview */}
			<Row className="g-4 mb-4">
				<Col md={3}>
					<Card className={styles.statCard}>
						<Card.Body>
							<div
								className={styles.statIcon}
								style={{
									background: 'linear-gradient(135deg, #00bf63 0%, #24570f 100%)',
								}}
							>
								<FaUsers />
							</div>
							<div className={styles.statContent}>
								{/* <h3>{totalStudents}</h3> */}
								<p>Total Students</p>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col md={3}>
					<Card className={styles.statCard}>
						<Card.Body>
							<div
								className={styles.statIcon}
								style={{
									background: 'linear-gradient(135deg, #5271ff 0%, #3451e6 100%)',
								}}
							>
								<FaDollarSign />
							</div>
							<div className={styles.statContent}>
								{/* <h3>${totalRevenue.toLocaleString()}</h3> */}
								<p>Total Revenue</p>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col md={3}>
					<Card className={styles.statCard}>
						<Card.Body>
							<div
								className={styles.statIcon}
								style={{
									background: 'linear-gradient(135deg, #f9c80e 0%, #d4a807 100%)',
								}}
							>
								<FaStar />
							</div>
							<div className={styles.statContent}>
								{/* <h3>{avgRating.toFixed(1)}</h3> */}
								<p>Average Rating</p>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col md={3}>
					<Card className={styles.statCard}>
						<Card.Body>
							<div
								className={styles.statIcon}
								style={{
									background: 'linear-gradient(135deg, #b9e185 0%, #8cc152 100%)',
								}}
							>
								<FaChartLine />
							</div>
							<div className={styles.statContent}>
								{/* <h3>{courses.length}</h3> */}
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
									variant={
										filterStatus === 'all' ? 'primary' : 'outline-secondary'
									}
									onClick={() => setFilterStatus('all')}
									className={styles.filterBtn}
								>
									All
								</Button>
								<Button
									variant={
										filterStatus === 'published'
											? 'primary'
											: 'outline-secondary'
									}
									onClick={() => setFilterStatus('published')}
									className={styles.filterBtn}
								>
									Published
								</Button>
								<Button
									variant={
										filterStatus === 'draft' ? 'primary' : 'outline-secondary'
									}
									onClick={() => setFilterStatus('draft')}
									className={styles.filterBtn}
								>
									Drafts
								</Button>
								<Button
									variant={
										filterStatus === 'archived'
											? 'primary'
											: 'outline-secondary'
									}
									onClick={() => setFilterStatus('archived')}
									className={styles.filterBtn}
								>
									Archived
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
									src={
										course.thumbnail_url ||
										'https://placehold.co/600x400/pink/black?text=image+here'
									}
									alt={course.title}
									className={styles.thumbnail}
								/>
								<Badge className={`${styles.statusBadge} ${styles[course.status]}`}>
									{course.status}
								</Badge>
							</div>
							<Card.Body>
								<div className={styles.courseHeader}>
									<Badge className={styles.categoryBadge}>
										{course.category || 'Uncategorized'}
									</Badge>
									<span className={styles.duration}>
										<FaClock /> {course.duration || 'N/A'}
									</span>
								</div>

								<h3 className={styles.courseTitle}>{course.title}</h3>

								<div className={styles.courseStats}>
									<div className={styles.statItem}>
										<FaUsers />
										<span>{course.students || 0} students</span>
									</div>
									{course.rating > 0 && (
										<div className={styles.statItem}>
											<FaStar />
											<span>
												{course.rating} ({course.reviews || 0})
											</span>
										</div>
									)}
								</div>

								<div className={styles.revenue}>
									<FaDollarSign />
									<span>${(course.revenue || 0).toLocaleString()}</span>
								</div>

								<div className={styles.lastUpdated}>
									Last updated: {new Date(course.updated_at).toLocaleDateString()}
								</div>

								<div className={styles.actions}>
									<Button
										className={styles.editBtn}
										onClick={() =>
											router.push(
												`/dashboard/instructor/courses/${course.id}/edit`
											)
										}
									>
										<FaEdit /> Edit
									</Button>
									<Button
										className={styles.viewBtn}
										onClick={() => router.push(`/courses/${course.id}`)}
									>
										<FaEye /> View
									</Button>
									<Button
										className={styles.deleteBtn}
										onClick={() => handleDelete(course.id)}
									>
										<FaTrash />
									</Button>
								</div>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row> 

			{/* {filteredCourses.length === 0 && (
				<div className={styles.noCourses}>
					<h3>No courses found</h3>
					<p>Try adjusting your search or filters</p>
				</div>
			)} */}
		</div>
	);
};

export default InstructorCourses;

function setLoading(arg0: boolean) {
	throw new Error('Function not implemented.');
}
