'use client';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Nav, Navbar, Button, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import styles from './_styles/mainNavbar.module.scss'

export default function MainNavbar() {
	return (
        <div>
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

		</div>
	);
}
