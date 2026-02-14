'use client';
import React from 'react';
import Link from 'next/link';
import { Clock, Award, BookOpen, Users, Star } from 'lucide-react';
import styles from '../_styles/courses/courseCardComponent.module.scss';

interface CourseCardProps {
	id?: number;
	title: string;
	shortDescription?: string;
	duration?: string;
	instructor?:
		| {
				firstName: string;
				lastName: string;
				profilePicture?: string;
		  }
		| string;
	price?: number;
	level?: string;
	tags?: string[];
	certificateAvailable?: boolean;
	language?: string;
	enrollmentCount?: number;
	rating?: number | string;
	thumbnailUrl?: string;
	slug?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
	id,
	title,
	shortDescription,
	duration,
	instructor,
	price = 0,
	level = 'beginner',
	tags = [],
	certificateAvailable = false,
	language = 'English',
	enrollmentCount = 0,
	rating = 4.5,
	thumbnailUrl,
	slug,
}) => {
	const isFree = price === 0 || !price;
	const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;

	const instructorName =
		typeof instructor === 'string'
			? instructor
			: instructor
				? `${instructor.firstName} ${instructor.lastName}`
				: 'Expert Instructor';

	const instructorImage =
		typeof instructor === 'object' && instructor?.profilePicture
			? instructor.profilePicture
			: 'https://i.pravatar.cc/150?img=1';

	const courseLink = slug ? `/course/${slug}` : id ? `/course/${id}` : '#';

	// Format price for South African Rand
	const formattedPrice = isFree ? 'Free' : `R${price}`;

	return (
		<Link href={courseLink} className={styles.courseCardLink}>
			<div className={styles.courseCard}>
				{/* Course Image */}
				<div className={styles.imageContainer}>
					{thumbnailUrl ? (
						<img src={thumbnailUrl} alt={title} className={styles.courseImage} />
					) : (
						<div className={styles.placeholder}>
							<BookOpen size={48} />
						</div>
					)}
					<div className={styles.badge}>
						<span className={isFree ? styles.freeBadge : styles.paidBadge}>
							{formattedPrice}
						</span>
					</div>
				</div>

				{/* Card Content */}
				<div className={styles.content}>
					<div className={styles.header}>
						<span className={`${styles.levelBadge} ${styles[level.toLowerCase()]}`}>
							{level.charAt(0).toUpperCase() + level.slice(1)}
						</span>
						{language && <span className={styles.language}>🌐 {language}</span>}
					</div>

					<h3 className={styles.title}>{title}</h3>

					{shortDescription && (
						<p className={styles.description}>
							{shortDescription.length > 100 
								? `${shortDescription.substring(0, 100)}...` 
								: shortDescription
							}
						</p>
					)}

					{/* Instructor Info */}
					<div className={styles.instructorInfo}>
						<img
							src={instructorImage}
							alt={instructorName}
							className={styles.instructorAvatar}
						/>
						<span className={styles.instructorName}>{instructorName}</span>
					</div>

					{/* Course Meta */}
					<div className={styles.meta}>
						{duration && (
							<div className={styles.metaItem}>
								<Clock size={16} />
								<span>{duration}</span>
							</div>
						)}
						{certificateAvailable && (
							<div className={styles.metaItem}>
								<Award size={16} />
								<span>Certificate</span>
							</div>
						)}
					</div>

					{/* Tags */}
					{tags && tags.length > 0 && (
						<div className={styles.tags}>
							{tags.slice(0, 3).map((tag, index) => (
								<span key={index} className={styles.tag}>
									{tag}
								</span>
							))}
						</div>
					)}

					{/* Footer */}
					<div className={styles.footer}>
						<div className={styles.enrolled}>
							<Users size={16} />
							<span>{enrollmentCount.toLocaleString()} students</span>
						</div>
						<div className={styles.rating}>
							<Star size={16} className={styles.starIcon} />
							<span className={styles.ratingValue}>{numericRating.toFixed(1)}</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default CourseCard;