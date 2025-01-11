'use client'
import React from 'react';
// import BadgeOverlay from '../components/badgeOverlayComponent';
import { Card, Button, Row, Col } from 'react-bootstrap';
import '../_styles/courses/courseComponent.module.scss';
import MainNavbar from '../_components/MainNavbar';

const mockCourses = [
  {
    id: 1,
    title: 'Introduction to Programming with Java',
    duration: '5 hours',
    instructor: 'John Doe',
    location: 'RoseBank',
    level: 'Beginner',
    category: ['Programming', 'Java'],
    isFree: true,
    enrolled: 125,
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    duration: '8 hours',
    instructor: 'Jane Smith',
    location: 'Sandton',
    level: 'Intermediate',
    category: ['Programming', 'JavaScript'],
    isFree: false,
    enrolled: 200,
  },
  // Add more mock courses if needed
];

const CourseComponent: React.FC = () => {
  return (
    <div className="courses-container">

		<MainNavbar></MainNavbar>
      <Row>
        {mockCourses.map((course) => (
          <Col key={course.id} md={6} lg={4} className="mb-4">
            <Card className="course-card">
              <div className="image-placeholder">
                {/* <BadgeOverlay label={course.isFree ? 'Free' : 'Paid'} variant={course.isFree ? 'success' : 'danger'} /> */}
              </div>
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>
                  <span>⏱ {course.duration}</span>
                  <br />
                  <span>👨‍🏫 {course.instructor}</span>
                  <br />
                  <span>📍 {course.location}</span>
                  <br />
                  <span>🎓 {course.level}</span>
                  <div className="tags">
                    {course.category.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card.Text>
                <Button variant="success">Enroll</Button>
              </Card.Body>
              <Card.Footer>
                <span>👥 {course.enrolled} enrolled</span>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CourseComponent;