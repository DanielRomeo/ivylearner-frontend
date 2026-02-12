'use client';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
// import ModernNavbar from '../_components/ModernNavbar';
import ModernNavbar from '../_components/MainNavbar';
import CourseCard from './courseCardComponent';
import styles from '../_styles/courses/coursesComponent.module.scss';
import axios from 'axios';

const ITEMS_PER_PAGE = 9;

const CoursesPage: React.FC = () => {
	const [courses, setCourses] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedLevel, setSelectedLevel] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);

	// Fetch courses on mount
	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		try {
			setLoading(true);
			// TODO: Replace with actual API call
			// const response = await axios.get('/api/courses/published');
			// setCourses(response.data.data);

			// Mock data for now
			const mockCourses = Array.from({ length: 24 }, (_, i) => ({
				id: i + 1,
				title: `Course ${i + 1}: ${['Web Development', 'Data Science', 'Mobile Apps', 'UI/UX Design', 'Machine Learning'][i % 5]}`,
				shortDescription:
					'Learn the fundamentals and advanced concepts with hands-on projects and real-world examples.',
				duration: `${Math.floor(Math.random() * 10) + 5} hours`,
				instructor: {
					firstName: ['John', 'Jane', 'Mike', 'Sarah', 'David'][i % 5],
					lastName: ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown'][i % 5],
					profilePicture: `https://i.pravatar.cc/150?img=${(i % 20) + 1}`,
				},
				thumbnailUrl: `https://picsum.photos/seed/${i}/400/250`,
				price: Math.random() > 0.3 ? Math.floor(Math.random() * 100) + 29 : 0,
				level: ['beginner', 'intermediate', 'advanced'][i % 3],
				certificateAvailable: Math.random() > 0.3,
				language: 'English',
				rating: (Math.random() * 2 + 3).toFixed(1),
				enrollmentCount: Math.floor(Math.random() * 1000) + 50,
				tags: ['Programming', 'Web', 'Backend', 'Frontend'].slice(
					0,
					Math.floor(Math.random() * 3) + 1
				),
			}));
			setCourses(mockCourses);
		} catch (error) {
			console.error('Error fetching courses:', error);
		} finally {
			setLoading(false);
		}
	};

	// Filter courses based on search and level
	const filteredCourses = courses.filter((course) => {
		const matchesSearch =
			course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			course.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
		return matchesSearch && matchesLevel;
	});

	// Pagination logic
	const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const currentCourses = filteredCourses.slice(startIndex, endIndex);

	// Reset to page 1 when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, selectedLevel]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className={styles.coursesPage}>
			<ModernNavbar />

			{/* Hero Section */}
			<div className={styles.heroSection}>
				<Container>
					<div className={styles.heroContent}>
						<h1>Explore Our Courses</h1>
						<p>Discover world-class courses taught by industry experts</p>
					</div>
				</Container>
			</div>

			{/* Search and Filter Section */}
			<div className={styles.filterSection}>
				<Container>
					<Row className="g-3">
						<Col md={8}>
							<InputGroup className={styles.searchBox}>
								<InputGroup.Text className={styles.searchIcon}>
									<Search size={20} />
								</InputGroup.Text>
								<Form.Control
									placeholder="Search courses..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className={styles.searchInput}
								/>
							</InputGroup>
						</Col>
						<Col md={4}>
							<Form.Select
								value={selectedLevel}
								onChange={(e) => setSelectedLevel(e.target.value)}
								className={styles.filterSelect}
							>
								<option value="all">All Levels</option>
								<option value="beginner">Beginner</option>
								<option value="intermediate">Intermediate</option>
								<option value="advanced">Advanced</option>
							</Form.Select>
						</Col>
					</Row>

					<div className={styles.resultsInfo}>
						<p>
							Showing <strong>{currentCourses.length}</strong> of{' '}
							<strong>{filteredCourses.length}</strong> courses
						</p>
					</div>
				</Container>
			</div>

			{/* Courses Grid */}
			<div className={styles.coursesSection}>
				<Container>
					{loading ? (
						<div className={styles.loading}>
							<div className={styles.spinner}></div>
							<p>Loading courses...</p>
						</div>
					) : currentCourses.length > 0 ? (
						<>
							<Row className="g-4">
								{currentCourses.map((course) => (
									<Col key={course.id} lg={4} md={6} sm={12}>
										<CourseCard {...course} />
									</Col>
								))}
							</Row>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className={styles.pagination}>
									<Button
										variant="outline-secondary"
										disabled={currentPage === 1}
										onClick={() => handlePageChange(currentPage - 1)}
										className={styles.paginationButton}
									>
										<ChevronLeft size={20} />
										Previous
									</Button>

									<div className={styles.pageNumbers}>
										{Array.from({ length: totalPages }, (_, i) => i + 1).map(
											(page) => (
												<Button
													key={page}
													variant={
														currentPage === page
															? 'success'
															: 'outline-secondary'
													}
													onClick={() => handlePageChange(page)}
													className={styles.pageNumber}
												>
													{page}
												</Button>
											)
										)}
									</div>

									<Button
										variant="outline-secondary"
										disabled={currentPage === totalPages}
										onClick={() => handlePageChange(currentPage + 1)}
										className={styles.paginationButton}
									>
										Next
										<ChevronRight size={20} />
									</Button>
								</div>
							)}
						</>
					) : (
						<div className={styles.noResults}>
							<Filter size={64} />
							<h3>No courses found</h3>
							<p>
								Try adjusting your search or filter to find what you're looking for.
							</p>
						</div>
					)}
				</Container>
			</div>
		</div>
	);
};

export default CoursesPage;
