'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col } from 'react-bootstrap';
import {
	FaHome,
	FaBook,
	FaChartLine,
	FaUserCircle,
	FaCog,
	FaSignOutAlt,
	FaBars,
	FaTimes,
	FaGraduationCap,
	FaChalkboardTeacher,
	FaUsers,
	FaFileAlt,
	FaBuilding,
} from 'react-icons/fa';
import { FaVideo } from "react-icons/fa";

import { useAuth } from '@/app/contexts/auth-context';
import styles from '../_styles/DashboardLayout.module.scss';

interface DashboardLayoutProps {
	children: React.ReactNode;
	userRole?: 'student' | 'instructor';
}

const DashboardLayout = ({ children, userRole = 'student' }: DashboardLayoutProps) => {
	// FIX: start closed on ALL screen sizes — user opens with hamburger
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const { logout, user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth <= 1024;
			setIsMobile(mobile);
			// Never auto-open — always let user control it
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const studentMenuItems = [
		{ name: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
		{ name: 'My Courses', icon: <FaBook />, path: '/dashboard/my-courses' },
		{ name: 'Progress', icon: <FaChartLine />, path: '/dashboard/progress' },
		{ name: 'Profile', icon: <FaUserCircle />, path: '/dashboard/profile' },
		{ name: 'Settings', icon: <FaCog />, path: '/dashboard/settings' },
	];

	const instructorMenuItems = [
		{ name: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
		{ name: 'My Courses', icon: <FaChalkboardTeacher />, path: '/dashboard/instructor/courses' },
		{ name: 'Online Classes', icon: <FaVideo />, path: '/dashboard/instructor/live-classes' },
		{ name: 'Organisation', icon: <FaBuilding />, path: '/dashboard/instructor/organisations' },
		{ name: 'Profile', icon: <FaUserCircle />, path: '/dashboard/instructor/profile' },
		{ name: 'Settings', icon: <FaCog />, path: '/dashboard/instructor/settings' },
	];

	const menuItems = userRole === 'instructor' ? instructorMenuItems : studentMenuItems;

	const handleNavigation = (path: string) => {
		router.push(path);
		setSidebarOpen(false); // Always close after navigation
	};

	const handleLogout = () => {
		logout();
	};

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	return (
		<div className={styles.dashboardContainer}>
			{/* Overlay — shown on ALL screen sizes when sidebar is open */}
			{sidebarOpen && (
				<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
			)}

			{/* Hamburger — always visible on ALL screen sizes */}
			<button
				className={styles.mobileToggle}
				onClick={toggleSidebar}
				aria-label="Toggle menu"
			>
				{sidebarOpen ? <FaTimes /> : <FaBars />}
			</button>

			{/* Sidebar — slides in from left when open */}
			<aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
				<div className={styles.sidebarHeader}>
					<div className={styles.logoContainer}>
						<h2 className={styles.logo}>IvyBrilliance</h2>
					</div>
				</div>

				<div className={styles.userInfo}>
					<div className={styles.avatarCircle}>
						<FaUserCircle size={48} />
					</div>
					<div className={styles.userDetails}>
						<h4>{user?.email?.split('@')[0] || 'User'}</h4>
						<p className={styles.userRole}>
							{userRole === 'instructor' ? 'Instructor' : 'Student'}
						</p>
					</div>
				</div>

				<nav className={styles.nav}>
					<ul className={styles.navList}>
						{menuItems.map((item, index) => (
							<li key={index} className={styles.navItem}>
								<button
									className={styles.navLink}
									onClick={() => handleNavigation(item.path)}
								>
									<span className={styles.navIcon}>{item.icon}</span>
									<span className={styles.navText}>{item.name}</span>
								</button>
							</li>
						))}
					</ul>

					<div className={styles.navDivider}></div>

					<ul className={styles.navList}>
						<li className={styles.navItem}>
							<button className={styles.navLink} onClick={handleLogout}>
								<span className={styles.navIcon}><FaSignOutAlt /></span>
								<span className={styles.navText}>Logout</span>
							</button>
						</li>
					</ul>
				</nav>
			</aside>

			{/* Main Content — always full width since sidebar is overlaid */}
			<main className={styles.mainContent}>
				<div className={styles.contentWrapper}>
					{React.cloneElement(children as React.ReactElement, {
						sidebarOpen,
						isMobile,
					})}
				</div>
			</main>
		</div>
	);
};

export default DashboardLayout;