'use client';
import React from 'react';
import styles from '../_styles/courses/courseCardComponent.module.scss';

interface CourseCardProps {
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

const CourseCard: React.FC<CourseCardProps> = ({
	title,
	duration,
	instructor,
	location,
	certificate,
	level,
	categories,
	isFree,
	enrolledCount,
	rating,
	imageUrl,
}) => {
	// Calculate filled and empty stars
	const filledStars = '★'.repeat(Math.floor(rating));
	const emptyStars = '☆'.repeat(5 - Math.floor(rating));

	return (
		<div className={styles.courseCard}>
			{/* Placeholder Image */}
			<div className={styles.imageContainer}>
				{imageUrl ? (
					<img src={imageUrl} alt={title} className={styles.courseImage} />
				) : (
					<div className={styles.placeholder}>
						<span>400 x 200</span>
					</div>
				)}
				<div className={styles.badge}>
					<span>{isFree ? 'Free' : 'Paid'}</span>
				</div>
			</div>

			{/* Card Content */}
			<div className={styles.content}>
				<h2>{title}</h2>

				{/* Course Details */}
				<div className={styles.details}>
					<div className={styles.detailItem}>
						<span className={styles.icon}>⏱</span>
						<span>{duration}</span>
					</div>
					<div className={styles.detailItem}>
						<span className={styles.icon}>👤</span>
						<span>{instructor}</span>
					</div>
					<div className={styles.detailItem}>
						<span className={styles.icon}>📍</span>
						<span>{location}</span>
					</div>
					{certificate && (
						<div className={styles.detailItem}>
							<span className={styles.icon}>🎖</span>
							<span>Certificate</span>
						</div>
					)}
				</div>

				{/* Tags */}
				<div className={styles.tags}>
					<span className={styles.tag}>{level}</span>
					{categories.map((category, index) => (
						<span key={index} className={styles.tag}>
							{category}
						</span>
					))}
				</div>

				{/* Enroll Button */}
				<button className={styles.enrollButton}>View Course</button>

				{/* Footer */}
				<div className={styles.footer}>
					<div className={styles.enrolled}>
						<span className={styles.icon}>👥</span>
						<span>{enrolledCount} enrolled</span>
					</div>
					<div className={styles.rating}>
						<div className={styles.stars}>
							<span className={styles.filled}>{filledStars}</span>
							<span className={styles.empty}>{emptyStars}</span>
						</div>
						<span className={styles.score}>({rating.toFixed(1)})</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseCard;
