'use client';
import React from 'react';
// import styles from '../_styles/organisation/organisationComponent.module.scss';
import styles from '../../_styles/organisationComponent.module.scss'
// import CourseCard from '../_components/CourseCard';\
import CourseComponent from '../../courses/coursesComponent';
import { FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

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

const OrganisationComponent = () => {
  // Mock data - replace with actual API call
  const organization: Organization = {
    id: 1,
    name: "Tech Academy",
    description: "A comprehensive technology education institution dedicated to providing quality education in programming, design, and digital skills.",
    shortDescription: "Leading tech education provider",
    banner: "/banner-placeholder.jpg",
    logo: "/logo-placeholder.jpg",
    website: "www.techacademy.com",
    email: "contact@techacademy.com",
    phone: "+1 234 567 8900",
    address: "123 Tech Street, Digital City",
    socialMedia: JSON.stringify({
      facebook: "techacademy",
      twitter: "techacademy",
      linkedin: "techacademy",
      instagram: "techacademy"
    }),
    verificationStatus: "verified",
    foundedYear: 2015,
    createdBy: 1
  };

  // Mock courses - replace with actual API call
  const courses: Course[] = [
    // Add mock courses here
  ];

  const socialMediaLinks: SocialMedia = JSON.parse(organization.socialMedia);

  return (
    <div className={styles.organisationPage}>
      {/* Banner Section */}
      <div 
        className={styles.banner}
        style={{ backgroundImage: `url(${organization.banner})` }}
      >
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
              <p>{organization.shortDescription}</p>
              <p className={styles.foundedYear}>Founded in {organization.foundedYear}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.contentGrid}>
          {/* Left Column - Organization Details */}
          <div className={styles.leftColumn}>
            <section className={styles.aboutSection}>
              <h2>About</h2>
              <p>{organization.description}</p>
            </section>

            <section className={styles.contactSection}>
              <h2>Contact Information</h2>
              <div className={styles.contactGrid}>
                <div className={styles.contactItem}>
                  <FaGlobe />
                  <a href={`https://${organization.website}`} target="_blank" rel="noopener noreferrer">
                    {organization.website}
                  </a>
                </div>
                <div className={styles.contactItem}>
                  <FaEnvelope />
                  <a href={`mailto:${organization.email}`}>{organization.email}</a>
                </div>
                <div className={styles.contactItem}>
                  <FaPhone />
                  <span>{organization.phone}</span>
                </div>
                <div className={styles.contactItem}>
                  <FaMapMarkerAlt />
                  <span>{organization.address}</span>
                </div>
              </div>
            </section>

            <section className={styles.socialSection}>
              <h2>Social Media</h2>
              <div className={styles.socialLinks}>
                {Object.entries(socialMediaLinks).map(([platform, handle]) => (
                  <a 
                    key={platform}
                    href={`https://${platform}.com/${handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Courses */}
          <div className={styles.rightColumn}>
            <h2>Courses</h2>
            <div className={styles.coursesGrid}>
              {courses.map(course => (
                <CourseComponent key={course.id} {...course} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganisationComponent;