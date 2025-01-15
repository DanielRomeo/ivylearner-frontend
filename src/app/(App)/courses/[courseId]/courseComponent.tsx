// app/courses/[id]/CourseComponent.tsx
'use client';
import React from 'react';
// import styles from './_styles/coursePage.module.scss';
import styles from '../../_styles/courses/oneCourseComponent.module.scss'
import { 
  FaClock, 
  FaStar, 
  FaGraduationCap, 
  FaLanguage, 
  FaCertificate, 
  FaUserFriends, 
  FaCalendarAlt, 
  FaTag 
} from 'react-icons/fa';

interface CourseProps {
  course: {
    id: number;
    title: string;
    shortDescription: string;
    description: string;
    thumbnail: string;
    price: number;
    duration: number;
    level: string;
    prerequisites: string;
    objectives: string;
    tags: string;
    language: string;
    certificateAvailable: boolean;
    featured: boolean;
    rating: number;
    enrollmentCount: number;
    publishStatus: string;
    publishedAt: number;
    lastUpdated: number;
    organisationId: number;
    createdBy: number;
  }
}

const OneCourseComponent: React.FC<CourseProps> = ({ course }) => {
  const tags = JSON.parse(course.tags || '[]');
  const objectives = course.objectives ? JSON.parse(course.objectives) : [];
  const prerequisites = course.prerequisites ? JSON.parse(course.prerequisites) : [];
  
  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Format price
  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.coursePage}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.courseInfo}>
            <h1>{course.title}</h1>
            <p className={styles.shortDescription}>{course.shortDescription}</p>
            <div className={styles.courseStats}>
              <span className={styles.stat}>
                <FaStar className={styles.icon} />
                {course.rating.toFixed(1)} Rating
              </span>
              <span className={styles.stat}>
                <FaUserFriends className={styles.icon} />
                {course.enrollmentCount} Students
              </span>
              <span className={styles.stat}>
                <FaCalendarAlt className={styles.icon} />
                Last updated {formatDate(course.lastUpdated)}
              </span>
            </div>
          </div>
          <div className={styles.courseCard}>
            <img src={course.thumbnail} alt={course.title} className={styles.thumbnail} />
            <div className={styles.cardContent}>
              <div className={styles.price}>{formatPrice(course.price)}</div>
              <button className={styles.enrollButton}>
                {course.price === 0 ? 'Enroll Now' : 'Buy Now'}
              </button>
              <div className={styles.courseDetails}>
                <div className={styles.detailItem}>
                  <FaClock className={styles.icon} />
                  <span>{formatDuration(course.duration)}</span>
                </div>
                <div className={styles.detailItem}>
                  <FaGraduationCap className={styles.icon} />
                  <span>{course.level}</span>
                </div>
                <div className={styles.detailItem}>
                  <FaLanguage className={styles.icon} />
                  <span>{course.language}</span>
                </div>
                {course.certificateAvailable && (
                  <div className={styles.detailItem}>
                    <FaCertificate className={styles.icon} />
                    <span>Certificate Available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Description */}
            <section className={styles.section}>
              <h2>Description</h2>
              <div className={styles.description}>{course.description}</div>
            </section>

            {/* Learning Objectives */}
            <section className={styles.section}>
              <h2>What you'll learn</h2>
              <ul className={styles.objectivesList}>
                {objectives.map((objective: string, index: number) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </section>

            {/* Prerequisites */}
            <section className={styles.section}>
              <h2>Prerequisites</h2>
              <ul className={styles.prerequisitesList}>
                {prerequisites.map((prerequisite: string, index: number) => (
                  <li key={index}>{prerequisite}</li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Column - Tags */}
          <div className={styles.rightColumn}>
            <section className={styles.section}>
              <h2>Tags</h2>
              <div className={styles.tags}>
                {tags.map((tag: string, index: number) => (
                  <span key={index} className={styles.tag}>
                    <FaTag className={styles.icon} />
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneCourseComponent;