// app/dashboard/components/Sidebar.tsx
import Image from 'next/image';
import { PropsWithChildren, useState } from 'react';
import {Button} from 'react-bootstrap'
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaCommentAlt,
    FaShoppingBag,
    FaThList
}from "react-icons/fa";
import Link from 'next/link';
// import { NavLink } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';
import { FaChalkboardTeacher, FaUserCircle, FaUsersCog } from 'react-icons/fa';
import styles from '../../_styles/dashboard/sidebar.module.scss';
import SidebarMenu from 'react-bootstrap-sidebar-menu';
// import SidebarMenu from 'react-bootstrap-sidebar-menu';
// import styles from 'react-bootstrap-sidebar-menu/dist/sidebar-menu.scss';
// import 'react-bootstrap-sidebar-menu/dist/sidebar-menu.scss';



interface SidebarProps {
    instructor: {
        firstName: string;
        lastName: string;
        profilePicture: string;
    };
    activeView: string;
    onViewChange: (view: 'courses' | 'organizations' | 'profile') => void;
    children?: React.ReactNode;
}


export default function Sidebar({ 
    instructor, 
    activeView, 
    onViewChange, 
    children 
}: SidebarProps) {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);


// Type-safe menu item definition
interface MenuItem {
    path: string;
    name: string;
    icon: React.ReactNode;
}
   
const menuItems = [
	{
		path: '/courses',
		name: 'Courses',
		icon: <FaChalkboardTeacher />,
		view: 'courses' as const
	},
	{
		name: 'Organizations',
		icon: <FaThList />,
		view: 'organizations' as const
	},
	{
		name: 'Profile',
		icon: <FaUserCircle />,
		view: 'profile' as const
	}
];

    return (
        <div className={styles.container}>
            <motion.div 
                initial={{ width: '50px' }}
                animate={{ width: isOpen ? '200px' : '50px' }}
                className={styles.sidebar}
            >
                <div className={styles.top_section}>
                    <h1 
                        style={{ display: isOpen ? "block" : "none" }} 
                        className={styles.logo}
                    >
                        Logo
                    </h1>
                    <div 
                        style={{ marginLeft: isOpen ? "50px" : "0px" }} 
                        className={styles.bar}
                    >
                        <FaBars onClick={toggle}/>
                    </div>
                </div>
                {menuItems.map((item, index) => (
                    <div 
                        onClick={() => onViewChange(item.view)} 
                        key={index} 
                        className={styles.link}
                    >
                        <div className={styles.icon}>{item.icon}</div>
                        <div 
                            style={{ display: isOpen ? "block" : "none" }} 
                            className={styles.link_text}
                        >
                            {item.name}
                        </div>
                    </div>
                ))}
            </motion.div>
            <main>{children}</main>
        </div>
    );
};
