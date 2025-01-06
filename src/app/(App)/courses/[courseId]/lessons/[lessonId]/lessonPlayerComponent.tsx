// pages/courses/[courseId]/lessons/[lessonId].tsx
'use client'
import { useState } from 'react';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import ReactPlayer from 'react-player';

// styles:
import styles from '../../../../_styles/courses/lessonPlayer.module.scss'

interface Lesson {
	id: string;
	title: string;
	duration: string;
	type: 'VIDEO' | 'ASSIGNMENT';
	completed?: boolean;
}

const lessons: Lesson[] = [
	{ id: '1', title: 'Video 1: Intro', duration: '3 MIN', type: 'VIDEO' },
	{ id: '2', title: 'Parsing Payloads', duration: '15 MIN', type: 'VIDEO' },
	{ id: '3', title: 'Routing Requests', duration: '14 MIN', type: 'VIDEO' },
	{ id: '4', title: 'Returning JSON', duration: '5 MIN', type: 'VIDEO' },
	{ id: '5', title: 'Adding Configuration', duration: '14 MIN', type: 'VIDEO' },
	{ id: '6', title: 'Adding HTTPS Support', duration: '17 MIN', type: 'VIDEO' },
	{ id: '7', title: 'Service 1: /ping', duration: '5 MIN', type: 'VIDEO' },
	{ id: '8', title: 'Homework Assignment #1', duration: '', type: 'ASSIGNMENT' },
	// ... add more lessons as needed
];

export default function LessonPlayer() {
	const [currentLesson, setCurrentLesson] = useState(lessons[0]);

	return (
		<div className={styles.courseContainer}>
			<div className={styles.header}>
				<Button variant="link" className={styles.backButton} href="/dashboard">
					← Go to Dashboard
				</Button>
				<div className={styles.logo}>PIRPLE</div>
			</div>

			<Container fluid className={styles.mainContent}>
				<Row>
					<Col md={3} className={styles.sidebar}>
						<ListGroup variant="flush">
							{lessons.map((lesson) => (
								<ListGroup.Item
									key={lesson.id}
									active={lesson.id === currentLesson.id}
									action
									onClick={() => setCurrentLesson(lesson)}
									className={styles.lessonItem}
								>
									<div className={styles.lessonInfo}>
										<span className={styles.icon}>
											{lesson.type === 'VIDEO' ? '▶' : '📝'}
										</span>
										<div className={styles.lessonDetails}>
											<div className={styles.lessonTitle}>{lesson.title}</div>
											{lesson.duration && (
												<small className={styles.duration}>
													{lesson.duration}
												</small>
											)}
										</div>
									</div>
									{lesson.completed && (
										<span className={styles.completedIcon}>✓</span>
									)}
								</ListGroup.Item>
							))}
						</ListGroup>
					</Col>

					<Col md={9} className={styles.playerContainer}>
						<div className={styles.videoWrapper}>
							<ReactPlayer
								url="your-video-url-here"
								width="100%"
								height="100%"
								controls
								playing
								config={{
									file: {
										attributes: {
											controlsList: 'nodownload',
										},
									},
								}}
							/>
						</div>
						<div className={styles.lessonControls}>
							<div className={styles.progress}>
								<span>MARK INCOMPLETE</span>
							</div>
							<Button variant="primary">CONTINUE →</Button>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
}
