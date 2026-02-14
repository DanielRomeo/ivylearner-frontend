'use client';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import ModernNavbar from '../_components/MainNavbar';
import CourseCard from './courseCardComponent';
import styles from '../_styles/courses/coursesComponent.module.scss';

const ITEMS_PER_PAGE = 3; // Changed from 9 to 3

const CoursesPage: React.FC = () => {
	const [courses, setCourses] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedFilter, setSelectedFilter] = useState('all'); // Changed from selectedLevel
	const [currentPage, setCurrentPage] = useState(1);

	// Fetch courses on mount
	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		try {
			setLoading(true);
			
			// Fetch real courses from API
			const response = await fetch('/api/courses', {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Failed to fetch courses');
			}

			const data = await response.json();
			const coursesList = data.data || data || [];
			
			console.log('Fetched courses:', coursesList);
			setCourses(coursesList);
		} catch (error) {
			console.error('Error fetching courses:', error);
			setCourses([]); // Set empty array on error
		} finally {
			setLoading(false);
		}
	};

	// Filter courses based on search and price filter
	const filteredCourses = courses.filter((course) => {
		const matchesSearch =
			course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			course.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase());
		
		// Filter by price (free vs paid)
		let matchesFilter = true;
		if (selectedFilter === 'free') {
			matchesFilter = course.price === 0 || !course.price;
		} else if (selectedFilter === 'paid') {
			matchesFilter = course.price > 0;
		}
		// 'all' means no filter
		
		return matchesSearch && matchesFilter;
	});

	// Pagination logic
	const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const currentCourses = filteredCourses.slice(startIndex, endIndex);

	// Reset to page 1 when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, selectedFilter]);

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
								value={selectedFilter}
								onChange={(e) => setSelectedFilter(e.target.value)}
								className={styles.filterSelect}
							>
								<option value="all">All Courses</option>
								<option value="free">Free Courses</option>
								<option value="paid">Paid Courses</option>
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
										<CourseCard
											id={course.id}
											title={course.title}
											shortDescription={course.shortDescription || course.description}
											duration={course.durationWeeks ? `${course.durationWeeks} weeks` : undefined}
											instructor={{
												firstName: 'Course',
												lastName: 'Instructor',
												profilePicture: undefined
											}}
											price={course.price || 0}
											level={course.level || 'beginner'}
											tags={course.tags ? JSON.parse(course.tags) : []}
											certificateAvailable={course.certificateAvailable || false}
											language={course.language || 'English'}
											enrollmentCount={course.enrollmentCount || 0}
											rating={course.rating || 4.5}
											thumbnailUrl={course.thumbnailUrl}
											slug={course.slug}
										/>
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