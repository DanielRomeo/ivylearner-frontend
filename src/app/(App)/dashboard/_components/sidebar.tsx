// app/dashboard/components/Sidebar.tsx
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from '../../_styles/dashboard/dashboard.module.scss';

interface SidebarProps {
	instructor: {
		firstName: string;
		lastName: string;
		profilePicture: string;
	};
	activeView: string;
	onViewChange: (view: 'courses' | 'organizations' | 'profile') => void;
}

export default function Sidebar({ instructor, activeView, onViewChange }: SidebarProps) {
	return (
		<div>
			<motion.div
				initial={{ x: -280 }}
				animate={{ x: 0 }}
				transition={{ duration: 0.5 }}
				className={styles.sidebar}
			>
				<div className={styles.profile}>
					<Image
						src={instructor.profilePicture || '/default-avatar.png'}
						alt="Profile"
						width={120}
						height={120}
						className={styles.avatar}
					/>
					<h2
						className={styles.name}
					>{`${instructor.firstName} ${instructor.lastName}`}</h2>
					<p className={styles.role}>Instructor</p>
				</div>

				<nav className={styles.navigation}>
					{['courses', 'organizations', 'profile'].map((view) => (
						<motion.div
							key={view}
							className={`${styles.navItem} ${activeView === view ? styles.active : ''}`}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() =>
								onViewChange(view as 'courses' | 'organizations' | 'profile')
							}
						>
							{view.charAt(0).toUpperCase() + view.slice(1)}
						</motion.div>
					))}
				</nav>
			</motion.div>
		</div>
	);
}
