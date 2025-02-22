'use client';
import React from 'react';
// import styles from '../_styles/organisation/organisationComponent.module.scss';
import styles from '../../_styles/organisationComponent.module.scss';
// import CourseCard from '../_components/CourseCard';\
import CourseCard from '../../courses/courseCardComponent';
// import { FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';


interface SocialMedia {
	facebook?: string;
	twitter?: string;
	linkedin?: string;
	instagram?: string;
}

interface Organization {
	id: number;
	name: string;
	description: string;
	shortDescription: string;
	banner: string;
	logo: string;
	website: string;
	email: string;
	phone: string;
	address: string;
	socialMedia: string; // JSON string
	verificationStatus: string;
	foundedYear: number;
	createdBy: number;
}

interface Course {
	id: number;
	title: string;
	duration: string;
	instructor: string;
	location: string;
	certificate: boolean;
	level: string;
	categories: string[];
	isFree: boolean;
	enrolledCount: number;
	rating: number;
	imageUrl?: string;
}
const getSocialIcon = (platform: string) => {
	switch (platform) {
	  case 'facebook': return <FaFacebook />;
	  case 'twitter': return <FaTwitter />;
	  case 'linkedin': return <FaLinkedin />;
	  case 'instagram': return <FaInstagram />;
	  default: return null;
	}
  };


const OrganisationComponent = () => {
	// Mock data - replace with actual API call
	const organization: Organization = {
		id: 1,
		name: 'Tech Academy',
		description:
			'A comprehensive technology education institution dedicated to providing quality education in programming, design, and digital skills.',
		shortDescription: 'Leading tech education provider',
		banner: '/banner-placeholder.jpg',
		logo: '/logo-placeholder.jpg',
		website: 'www.techacademy.com',
		email: 'contact@techacademy.com',
		phone: '+1 234 567 8900',
		address: '123 Tech Street, Digital City',
		socialMedia: JSON.stringify({
			facebook: 'techacademy',
			twitter: 'techacademy',
			linkedin: 'techacademy',
			instagram: 'techacademy',
		}),
		verificationStatus: 'verified',
		foundedYear: 2015,
		createdBy: 1,
	};

	// Mock courses - replace with actual API call
	const courses: Course[] = [
		{
			id: 1,
			title: 'Introduction to Web Development',
			duration: '8 hours',
			instructor: 'Sarah Johnson',
			location: 'Online',
			certificate: true,
			level: 'Beginner',
			categories: ['Programming', 'Web Development', 'HTML/CSS'],
			isFree: true,
			enrolledCount: 1250,
			rating: 4.8,
			imageUrl: '/web-dev-course.jpg',
		},
		{
			id: 2,
			title: 'Advanced React & Redux',
			duration: '12 hours',
			instructor: 'Michael Chen',
			location: 'Hybrid',
			certificate: true,
			level: 'Advanced',
			categories: ['Programming', 'React', 'JavaScript'],
			isFree: false,
			enrolledCount: 843,
			rating: 4.6,
			imageUrl: '/react-course.jpg',
		},
		{
			id: 3,
			title: 'UI/UX Design Fundamentals',
			duration: '6 hours',
			instructor: 'Emma Rodriguez',
			location: 'In Person',
			certificate: true,
			level: 'Intermediate',
			categories: ['Design', 'UI/UX', 'Figma'],
			isFree: false,
			enrolledCount: 567,
			rating: 4.2,
			imageUrl: '/uiux-course.jpg',
		},
		{
			id: 4,
			title: 'Python for Data Science',
			duration: '10 hours',
			instructor: 'David Kim',
			location: 'Online',
			certificate: true,
			level: 'Intermediate',
			categories: ['Programming', 'Python', 'Data Science'],
			isFree: false,
			enrolledCount: 982,
			rating: 4.7,
			imageUrl: '/python-course.jpg',
		},
	];

	const socialMediaLinks: SocialMedia = JSON.parse(organization.socialMedia);

	return (
		<div className={styles.organisationPage}>
		  <div className={styles.banner} style={{ backgroundImage: `url(${organization.banner})` }}>
			<div className={styles.overlay}>
			  <div className={styles.orgInfo}>
				<img src={organization.logo} alt={organization.name} className={styles.logo} />
				<div className={styles.titleSection}>
				  <h1>
					{organization.name}
					{organization.verificationStatus === 'verified' && (
					  <FaCheckCircle className={styles.verifiedBadge} />
					)}
				  </h1>
				  <p className={styles.description}>{organization.shortDescription}</p>
				  <p className={styles.foundedYear}>Est. {organization.foundedYear}</p>
				</div>
			  </div>
			</div>
		  </div>
	
		  <div className={styles.mainContent}>
			<div className={styles.contentGrid}>
			  <div className={styles.leftColumn}>
				<section className={styles.aboutSection}>
				  <h2>About Us</h2>
				  <p>{organization.description}</p>
				</section>
	
				<section className={styles.contactSection}>
				  <h2>Get in Touch</h2>
				  <div className={styles.contactGrid}>
					<a href={`https://${organization.website}`} className={styles.contactItem} target="_blank" rel="noopener noreferrer">
					  <FaGlobe className={styles.icon} />
					  <span>{organization.website}</span>
					</a>
					<a href={`mailto:${organization.email}`} className={styles.contactItem}>
					  <FaEnvelope className={styles.icon} />
					  <span>{organization.email}</span>
					</a>
					<div className={styles.contactItem}>
					  <FaPhone className={styles.icon} />
					  <span>{organization.phone}</span>
					</div>
					<div className={styles.contactItem}>
					  <FaMapMarkerAlt className={styles.icon} />
					  <span>{organization.address}</span>
					</div>
				  </div>
				</section>
	
				<section className={styles.socialSection}>
				  <h2>Connect With Us</h2>
				  <div className={styles.socialLinks}>
					{Object.entries(socialMediaLinks).map(([platform, handle]) => (
					  <a
						key={platform}
						href={`https://${platform}.com/${handle}`}
						target="_blank"
						rel="noopener noreferrer"
						className={styles.socialLink}
					  >
						{getSocialIcon(platform)}
						<span>{platform}</span>
					  </a>
					))}
				  </div>
				</section>
			  </div>
	
			  <div className={styles.rightColumn}>
				<div className={styles.sectionHeader}>
				  <h2>Our Courses</h2>
				  <p>Discover our comprehensive range of learning opportunities</p>
				</div>
				<div className={styles.coursesGrid}>
				  {courses.map((course) => (
					<CourseCard key={course.id} {...course} />
				  ))}
				</div>
			  </div>
			</div>
		  </div>
		</div>
	  );
	};
	
	export default OrganisationComponent;