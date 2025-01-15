// app/dashboard/components/CoursesList.tsx
import { useState, useEffect } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
// import styles from './CoursesList.module.scss';
import styles from '../../_styles/dashboard/coursesList.module.scss'

interface Course {
  id: number;
  title: string;
  shortDescription: string;
  publishStatus: 'draft' | 'published' | 'archived';
  lastUpdated: Date;
}

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/courses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <div className={styles.coursesList}>
      <div className={styles.header}>
        <h2>My Courses</h2>
        <Button variant="primary">Create New Course</Button>
      </div>

      <div className={styles.grid}>
        {courses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={styles.courseCard}>
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Badge bg={getStatusColor(course.publishStatus)}>
                  {course.publishStatus}
                </Badge>
                <Card.Text>{course.shortDescription}</Card.Text>
                <div className={styles.cardFooter}>
                  <small>Last updated: {new Date(course.lastUpdated).toLocaleDateString()}</small>
                  <Button variant="outline-primary" size="sm">Edit</Button>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}