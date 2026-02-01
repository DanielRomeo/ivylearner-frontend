'use client';

import { useState } from 'react';
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
} from 'react-icons/fa';
import { useAuth } from '@/app/contexts/auth-context';
import styles from './DashboardLayout.module.scss';

interface DashboardLayoutProps {
    children: React.ReactNode;
    userRole?: 'student' | 'instructor';
}

const DashboardLayout = ({ children, userRole = 'student' }: DashboardLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { logout, user } = useAuth();
    const router = useRouter();

    const studentMenuItems = [
        {
            name: 'Dashboard',
            icon: <FaHome />,
            path: '/dashboard',
        },
        {
            name: 'My Courses',
            icon: <FaBook />,
            path: '/dashboard/my-courses',
        },
        {
            name: 'Progress',
            icon: <FaChartLine />,
            path: '/dashboard/progress',
        },
        {
            name: 'Certificates',
            icon: <FaGraduationCap />,
            path: '/dashboard/certificates',
        },
        {
            name: 'Profile',
            icon: <FaUserCircle />,
            path: '/dashboard/profile',
        },
        {
            name: 'Settings',
            icon: <FaCog />,
            path: '/dashboard/settings',
        },
    ];

    const instructorMenuItems = [
        {
            name: 'Dashboard',
            icon: <FaHome />,
            path: '/dashboard/instructor',
        },
        {
            name: 'My Courses',
            icon: <FaChalkboardTeacher />,
            path: '/dashboard/instructor/courses',
        },
        {
            name: 'Students',
            icon: <FaUsers />,
            path: '/dashboard/instructor/students',
        },
        {
            name: 'Analytics',
            icon: <FaChartLine />,
            path: '/dashboard/instructor/analytics',
        },
        {
            name: 'Content',
            icon: <FaFileAlt />,
            path: '/dashboard/instructor/content',
        },
        {
            name: 'Profile',
            icon: <FaUserCircle />,
            path: '/dashboard/instructor/profile',
        },
        {
            name: 'Settings',
            icon: <FaCog />,
            path: '/dashboard/instructor/settings',
        },
    ];

    const menuItems = userRole === 'instructor' ? instructorMenuItems : studentMenuItems;

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className={styles.dashboardContainer}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoContainer}>
                        <h2 className={styles.logo}>IvyBrilliance</h2>
                    </div>
                    <button
                        className={styles.toggleBtn}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {sidebarOpen && (
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
                )}

                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        {menuItems.map((item, index) => (
                            <li key={index} className={styles.navItem}>
                                <button
                                    className={styles.navLink}
                                    onClick={() => handleNavigation(item.path)}
                                >
                                    <span className={styles.navIcon}>{item.icon}</span>
                                    {sidebarOpen && (
                                        <span className={styles.navText}>{item.name}</span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.navDivider}></div>

                    <ul className={styles.navList}>
                        <li className={styles.navItem}>
                            <button className={styles.navLink} onClick={handleLogout}>
                                <span className={styles.navIcon}>
                                    <FaSignOutAlt />
                                </span>
                                {sidebarOpen && (
                                    <span className={styles.navText}>Logout</span>
                                )}
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <div className={styles.contentWrapper}>{children}</div>
            </main>
        </div>
    );
};

export default DashboardLayout;