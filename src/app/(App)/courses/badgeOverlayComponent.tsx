import React from 'react';
import styles from '../_styles/courses/badgeOverlay.module.scss'
import { Badge } from 'react-bootstrap';

interface BadgeOverlayProps {
	label: string;
	variant?: string;
}

const BadgeOverlay: React.FC<BadgeOverlayProps> = ({ label, variant = 'dark' }) => {
	return (
		<div className="badge-overlay">
			<Badge bg={variant} className="badge-overlay-label">
				{label}
			</Badge>
		</div>
	);
};

export default BadgeOverlay;
