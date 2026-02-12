'use client';
import React, { useEffect } from 'react';
import ModernNavbar from '../_components/MainNavbar';
import { Container, Navbar, Nav, Button, Row, Col, Card } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
// import styles from './homeComponent.module.scss';
import styles from '../_styles/homeComponent.module.scss';
import ResponsiveImage from '../_components/ResponsiveImage';

export default function HomeComponent() {
	// Animation variants
	const fadeIn = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
	};

	const staggerChildren = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	return (
		<div className={styles.container}>
			{/* Navigation Bar */}
			{/* <Navbar expand="lg" className={styles.navbar} fixed="top">
				<Container>
					<Navbar.Brand href="/">
						<span className={styles.logoText}>IvyBrilliance</span>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="main-navbar" />
					<Navbar.Collapse id="main-navbar">
						<Nav className="ms-auto">
							<Nav.Link href="/courses">Courses</Nav.Link>
							<Nav.Link href="/tutors">Find Tutors</Nav.Link>
							<Nav.Link href="/about">About Us</Nav.Link>
							<Nav.Link href="/blog">Blog</Nav.Link>
						</Nav>
						<div className={styles.navButtons}>
							<Button
								variant="outline-light"
								className={styles.loginBtn}
								href="/signin"
							>
								Log In
							</Button>
							<Button variant="success" className={styles.signupBtn} href="/signup">
								Sign Up Free
							</Button>
						</div>
					</Navbar.Collapse>
				</Container>
			</Navbar> */}

			{/* Import the navbar */}
			<ModernNavbar></ModernNavbar>

			{/* Hero Section */}
			<section className={styles.heroSection}>
				<Container>
					<Row className="align-items-center">
						<Col lg={6}>
							<motion.div
								initial="hidden"
								animate="visible"
								variants={fadeIn}
								className={styles.heroContent}
							>
								<h1>
									Learning that puts <span className={styles.highlight}>you</span>{' '}
									first
								</h1>
								<p>
									Empower your future with personalized courses taught by expert
									instructors. Track your progress, connect with tutors, and learn
									at your own pace.
								</p>
								<div className={styles.heroCta}>
									<Button
										variant="success"
										size="lg"
										className={styles.primaryBtn}
									>
										Explore Courses
									</Button>
									<Button
										variant="outline-light"
										size="lg"
										className={styles.secondaryBtn}
									>
										Become a Tutor
									</Button>
								</div>
								<div className={styles.statBadges}>
									<div className={styles.statItem}>
										<span className={styles.statNumber}>200+</span>
										<span className={styles.statLabel}>Courses</span>
									</div>
									<div className={styles.statItem}>
										<span className={styles.statNumber}>50k+</span>
										<span className={styles.statLabel}>Students</span>
									</div>
									<div className={styles.statItem}>
										<span className={styles.statNumber}>96%</span>
										<span className={styles.statLabel}>Satisfaction</span>
									</div>
								</div>
							</motion.div>
						</Col>
						<Col lg={6}>
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.8 }}
								className={styles.heroImageContainer}
							>
								<div className={styles.heroImage}>
									{/* Replace with your actual image path */}
									<ResponsiveImage
										src="/pictureOfTeacher.jpg"
										alt={`New Arrival`}
										height={400}
										width={100}
									/>
								</div>
								{/* <div className={styles.floatingCard}>
									<div className={styles.progressIndicator}>
										<div className={styles.progressBar}>
											<div className={styles.progressFill}></div>
										</div>
										<span>75% Complete</span>
									</div>
									<h4>Introduction to Data Science</h4>
									<p>Next: Statistical Analysis Fundamentals</p>
								</div> */}
							</motion.div>
						</Col>
					</Row>
				</Container>
			</section>

			{/* Featured Courses Section */}
			<section className={styles.featuredSection}>
				<Container>
					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						variants={fadeIn}
						className={styles.sectionHeader}
					>
						<h2>Featured Courses</h2>
						<p>Start your learning journey with our most popular courses</p>
					</motion.div>

					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						variants={staggerChildren}
					>
						<Row className="g-4">
							{[
								{
									title: 'Web Development Masterclass',
									instructor: 'Sarah Johnson',
									rating: 4.9,
									students: 12453,
									image: '/images/course-web.png',
								},
								{
									title: 'Data Science & Machine Learning',
									instructor: 'Michael Chang',
									rating: 4.8,
									students: 9872,
									image: '/images/course-data.png',
								},
								{
									title: 'Financial Literacy Fundamentals',
									instructor: 'Jessica Williams',
									rating: 4.7,
									students: 7623,
									image: '/images/course-finance.png',
								},
							].map((course, index) => (
								<Col md={4} key={index}>
									<motion.div variants={fadeIn}>
										<Card className={styles.courseCard}>
											<div className={styles.courseImageContainer}>
												{/* <Image
													src={course.image}
													alt={course.title}
													width={350}
													height={200}
													className={styles.courseImage}
												/> */}
												<ResponsiveImage
													src="/pictureOfTeacher.jpg"
													alt={`New Arrival`}
													height={400}
													width={100}
												/>
												<div className={styles.courseOverlay}>
													<Button
														variant="light"
														className={styles.previewBtn}
													>
														Preview
													</Button>
												</div>
											</div>
											<Card.Body>
												<div className={styles.courseRating}>
													<span className={styles.ratingStars}>
														★★★★★
													</span>
													<span className={styles.ratingNumber}>
														{course.rating}
													</span>
													<span className={styles.studentCount}>
														({course.students.toLocaleString()}{' '}
														students)
													</span>
												</div>
												<Card.Title>{course.title}</Card.Title>
												<Card.Text>
													Instructor: {course.instructor}
												</Card.Text>
												<div className={styles.cardFooter}>
													<Button
														variant="outline-success"
														className={styles.courseBtn}
													>
														Learn More
													</Button>
												</div>
											</Card.Body>
										</Card>
									</motion.div>
								</Col>
							))}
						</Row>
					</motion.div>

					<div className={styles.viewAllContainer}>
						<Button variant="link" className={styles.viewAllBtn}>
							View All Courses <span className={styles.arrowIcon}>→</span>
						</Button>
					</div>
				</Container>
			</section>

			{/* How It Works Section */}
			<section className={styles.howItWorksSection}>
				<Container>
					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						variants={fadeIn}
						className={styles.sectionHeader}
					>
						<h2>How IvyBrilliance Works</h2>
						<p>A simple process to start your learning journey</p>
					</motion.div>

					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						variants={staggerChildren}
						className={styles.stepsContainer}
					>
						<Row>
							{[
								{
									number: '01',
									title: 'Find Your Course',
									description:
										'Browse through our catalog of premium courses taught by industry experts.',
								},
								{
									number: '02',
									title: 'Learn at Your Pace',
									description:
										'Access video lectures, quizzes, and resources whenever and wherever you want.',
								},
								{
									number: '03',
									title: 'Track Progress',
									description:
										'Monitor your learning journey with detailed progress tracking.',
								},
								{
									number: '04',
									title: 'Get Certified',
									description:
										'Earn certificates that showcase your newly acquired skills to employers.',
								},
							].map((step, index) => (
								<Col md={3} key={index}>
									<motion.div variants={fadeIn} className={styles.stepCard}>
										<div className={styles.stepNumber}>{step.number}</div>
										<h3>{step.title}</h3>
										<p>{step.description}</p>
									</motion.div>
								</Col>
							))}
						</Row>
					</motion.div>
				</Container>
			</section>

			{/* Become a Tutor Section */}
			<section className={styles.becomeInstructorSection}>
				<Container>
					<Row className="align-items-center">
						<Col lg={6}>
							<motion.div
								initial={{ opacity: 0, x: -50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, amount: 0.2 }}
								transition={{ duration: 0.6 }}
								className={styles.instructorImageContainer}
							>
								<ResponsiveImage
									src="/pictureOfTeacher.jpg"
									alt={`New Arrival`}
									height={550}
									width={450}
								/>
							</motion.div>
						</Col>
						<Col lg={6}>
							<motion.div
								initial={{ opacity: 0, x: 50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, amount: 0.2 }}
								transition={{ duration: 0.6 }}
								className={styles.instructorContent}
							>
								<h2>Share Your Knowledge</h2>
								<h3>Become an Instructor</h3>
								<p>
									Join our community of expert instructors and share your
									knowledge with students worldwide. Create engaging courses,
									build your audience, and earn income while making a difference.
								</p>

								<div className={styles.instructorBenefits}>
									{[
										'Reach thousands of eager students',
										'Flexible schedule on your terms',
										'Competitive compensation',
										'Full support from our team',
									].map((benefit, index) => (
										<div key={index} className={styles.benefitItem}>
											<span className={styles.checkIcon}>✓</span>
											{benefit}
										</div>
									))}
								</div>

								<Button
									variant="success"
									size="lg"
									className={styles.instructorCta}
								>
									Apply as Instructor
								</Button>
							</motion.div>
						</Col>
					</Row>
				</Container>
			</section>

			{/* Testimonials Section */}
			{/* <section className={styles.testimonialsSection}>
				<Container>
					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						variants={fadeIn}
						className={styles.sectionHeader}
					>
						<h2>What Our Students Say</h2>
						<p>Success stories from the IvyLearner community</p>
					</motion.div>

					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						variants={staggerChildren}
					>
						<Row className="g-4">
							{[
								{
									name: 'Alex Morgan',
									role: 'Software Developer',
									avatar: '/images/testimonial1.png',
									quote: "IvyLearner's web development course helped me transition from marketing to a full-stack developer role in just 6 months. The curriculum was comprehensive and the instructor support was exceptional.",
								},
								{
									name: 'Priya Sharma',
									role: 'Data Analyst',
									avatar: '/images/testimonial2.png',
									quote: 'The data science track provided me with practical skills I use every day. The projects were challenging but rewarding, and tracking my progress kept me motivated throughout the journey.',
								},
								{
									name: 'James Wilson',
									role: 'Startup Founder',
									avatar: '/images/testimonial3.png',
									quote: "As someone who needed flexible learning options, IvyLearner's platform was perfect. I could learn at my own pace while building my business, and the knowledge gained has been invaluable.",
								},
							].map((testimonial, index) => (
								<Col md={4} key={index}>
									<motion.div variants={fadeIn}>
										<div className={styles.testimonialCard}>
											<div className={styles.quoteIcon}>"</div>
											<p className={styles.quote}>{testimonial.quote}</p>
											<div className={styles.testimonialProfile}>
												<div className={styles.avatarContainer}>
													<Image
														src={testimonial.avatar}
														alt={testimonial.name}
														width={50}
														height={50}
														className={styles.avatar}
													/>
												</div>
												<div className={styles.profileInfo}>
													<h4>{testimonial.name}</h4>
													<p>{testimonial.role}</p>
												</div>
											</div>
										</div>
									</motion.div>
								</Col>
							))}
						</Row>
					</motion.div>
				</Container>
			</section> */}

			{/* Universities & Companies Section */}
			<section className={styles.partnersSection}>
				<Container>
					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						variants={fadeIn}
						className={styles.sectionHeader}
					>
						<h2>Trusted By Leading Organizations</h2>
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className={styles.partnersLogo}
					>
						<Row className={`align-items-center ${styles.partnersLogoRow}`}>
							{[
								'econlogo8-removebg-preview.png',
								'mainlogo.png',
								'unisalogo8-removebg-preview.png',
							].map((logo, index) => (
								<Col key={index} xs={6} md={2} className="text-center">
									<ResponsiveImage
										className={styles.image}
										src={`/${logo}`}
										alt="Partner logo"
										width={120}
										height={60}
									/>
								</Col>
							))}
						</Row>
					</motion.div>
				</Container>
			</section>

			{/* CTA Section */}
			<section className={styles.ctaSection}>
				<Container>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className={styles.ctaCard}
					>
						<h2>Ready to Start Your Learning Journey?</h2>
						<p>Join thousands of students already learning on IvyBrilliance</p>
						<div className={styles.ctaButtons}>
							<Button variant="light" size="lg" className={styles.ctaBtn}>
								View All Courses
							</Button>
							<Button variant="success" size="lg" className={styles.ctaBtnPrimary}>
								Sign Up Free
							</Button>
						</div>
					</motion.div>
				</Container>
			</section>

			{/* Footer */}
			<footer className={styles.footer}>
				<Container>
					<Row>
						<Col lg={4} md={6} className={styles.footerBrand}>
							<h3 className={styles.footerLogo}>IvyBrilliance</h3>
							<p>
								Continuing education for everyone. Learn at your own pace with
								expert-led courses designed for real-world skills.
							</p>
							{/* <div className={styles.socialIcons}>
								<a href="#" aria-label="Facebook">
									<i className="fab fa-facebook-f"></i>
								</a>
								<a href="#" aria-label="Twitter">
									<i className="fab fa-twitter"></i>
								</a>
								<a href="#" aria-label="Instagram">
									<i className="fab fa-instagram"></i>
								</a>
								<a href="#" aria-label="LinkedIn">
									<i className="fab fa-linkedin-in"></i>
								</a>
							</div> */}
						</Col>

						<Col lg={2} md={6} sm={6} className={styles.footerLinks}>
							<h4>Explore</h4>
							<ul>
								<li>
									<a href="/courses">All Courses</a>
								</li>
								<li>
									<a href="/tutors">Find Tutors</a>
								</li>
								<li>
									<a href="/pricing">Pricing</a>
								</li>
								<li>{/* <a href="/enterprise">For Enterprise</a> */}</li>
							</ul>
						</Col>

						<Col lg={2} md={6} sm={6} className={styles.footerLinks}>
							<h4>Resources</h4>
							<ul>
								<li>
									<a href="/blog">Blog</a>
								</li>
								<li>
									<a href="/tutorials">Tutorials</a>
								</li>
								<li>{/* <a href="/webinars">Webinars</a> */}</li>
								<li>
									<a href="/community">Community</a>
								</li>
							</ul>
						</Col>

						<Col lg={2} md={6} sm={6} className={styles.footerLinks}>
							<h4>Company</h4>
							<ul>
								<li>
									<a href="/about">About Us</a>
								</li>
								<li>
									<a href="/careers">Careers</a>
								</li>
								<li>{/* <a href="/press">Press</a> */}</li>
								<li>
									<a href="/contact">Contact Us</a>
								</li>
							</ul>
						</Col>

						<Col lg={2} md={6} sm={6} className={styles.footerLinks}>
							<h4>Legal</h4>
							<ul>
								<li>
									<a href="/terms">Terms of Service</a>
								</li>
								<li>
									<a href="/privacy">Privacy Policy</a>
								</li>
								<li>
									<a href="/cookies">Cookie Policy</a>
								</li>
								<li>{/* <a href="/accessibility">Accessibility</a> */}</li>
							</ul>
						</Col>
					</Row>

					<div className={styles.footerBottom}>
						<p>&copy; {new Date().getFullYear()} IvyBrilliance. All rights reserved.</p>
						{/* <div className={styles.footerBottomLinks}>
							<a href="/help">Help Center</a>
							<a href="/sitemap">Sitemap</a>
						</div> */}
					</div>
				</Container>
			</footer>
		</div>
	);
}
