'use client';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Nav, Navbar, Button, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import styles from '../_styles/homeComponent.module.scss';

export default function HomeComponent() {
	return (
		<div className={styles.container}>
			<Navbar expand="lg" variant="dark" className={styles.navbar}>
				<Container>
					<Navbar.Brand href="#home">LOGO</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="ms-auto">
							<Nav.Link href="/courses">Courses</Nav.Link>
							<Nav.Link href="/signup">Sign Up</Nav.Link>
							<Nav.Link href="/signin">Login</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>

			<Container>
				<section className={styles.hero}>
					<h1>Welcome to Ivy Learner</h1>
					<p>Continuing education for Everyone.</p>
					<div className={styles.cta}>
						<Button variant="warning" size="lg" className={`me-3 ${styles.actionButtonLarge}`}>
							About Us
						</Button>
						<Button variant="outline-light" size="lg">
							Browse The Courses
						</Button>
					</div>
				</section>

				<section className={styles.courses}>
					<h2>Browse the Courses</h2>
					<p>
						Each course consists of video-lectures, progression bars in order to track your progress and additional resources. Scroll down to read the curricula, and to watch
						overviews and sample lectures.
					</p>

					<Row className="g-4"></Row>
				</section>
			</Container>
		</div>
	);
}
