import React from 'react';
import './BadgeOverlay.scss';
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