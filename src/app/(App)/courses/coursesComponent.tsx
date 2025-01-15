'use client';
import React from 'react';
import BadgeOverlay from './badgeOverlayComponent';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import '../_styles/courses/courseComponent.module.scss';
import MainNavbar from '../_components/MainNavbar';
import CourseCard from './courseCardComponent';

const CourseList = () => {
	const courseData = {
		title: 'Introduction to Programming with Java',
		duration: '5 hours',
		instructor: 'John Doe',
		location: 'RoseBank',
		certificate: true,
		level: 'Beginner',
		categories: ['Programming', 'Java'],
		isFree: true,
		enrolledCount: 125,
		rating: 4.2,
	};

	const courseData2 = {
		title: 'Introduction to Programming with Java',
		duration: '5 hours',
		instructor: 'John Doe',
		location: 'RoseBank',
		certificate: true,
		level: 'Beginner',
		categories: ['Programming', 'Java'],
		isFree: true,
		enrolledCount: 125,
		rating: 4.2,
	};

	return (
		<Container>
			<Row>
				<Col lg={4} md={6} sm={6} xs={12}>
					<CourseCard {...courseData} />
					<br />
				</Col>

				<Col lg={4} md={6} sm={6} xs={12}>
					<CourseCard {...courseData} />
					<br />
				</Col>

				<Col lg={4} md={6} sm={6} xs={12}>
					<CourseCard {...courseData} />
					<br />
				</Col>
			</Row>
		</Container>
	);
};

const CourseComponent: React.FC = () => {
	return (
		<div className="courses-container">
			<MainNavbar></MainNavbar>

			<CourseList></CourseList>
		</div>
	);
};

export default CourseComponent;
