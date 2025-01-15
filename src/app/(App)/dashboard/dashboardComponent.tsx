// app/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

// components imported:
import Sidebar from './_components/sidebar';
import CoursesList from './_components/coursesList';
import OrganizationsList from './_components/organisationList';
import Profile from './_components/profile';
import styles from '../_styles/dashboard/coursesList.module.scss'

// Types
interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture: string;
  bio: string;
  specialization: string;
}

interface Course {
  id: number;
  title: string;
  shortDescription: string;
  publishStatus: 'draft' | 'published' | 'archived';
  lastUpdated: Date;
}

interface Organization {
  id: number;
  name: string;
  logo: string;
}

export default function DashboardComponent() {
  const router = useRouter();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [activeView, setActiveView] = useState<'courses' | 'organizations' | 'profile'>('courses');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    // Fetch instructor data
    fetchInstructorData(token);
  }, []);

  const fetchInstructorData = async (token: string) => {
    try {
      const response = await fetch('/api/instructor/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch instructor data');
      
      const data = await response.json();
      setInstructor(data);
    } catch (error) {
      console.error('Error fetching instructor data:', error);
      router.push('/signin');
    }
  };

  if (!instructor) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.dashboard}
    >
      <Sidebar
        instructor={instructor}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      <main className={styles.mainContent}>
        <Container fluid>
          <Row>
            <Col>
              {activeView === 'courses' && <CoursesList />}
              {activeView === 'organizations' && <OrganizationsList />}
              {activeView === 'profile' && (
                <Profile 
                  instructor={instructor}
                  onUpdate={(updatedData) => setInstructor({ ...instructor, ...updatedData })}
                />
              )}
            </Col>
          </Row>
        </Container>
      </main>
    </motion.div>
  );
}