'use client';

import { useState } from 'react';
import { Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { 
    FaUser, 
    FaEnvelope, 
    FaGlobe, 
    FaCamera, 
    FaSave, 
    FaBriefcase,
    FaAward,
    FaChalkboardTeacher,
    FaClock,
    FaEdit,
    FaPlus
} from 'react-icons/fa';

interface CreateOrganisationProps {
    sidebarOpen?: boolean;
    isMobile?: boolean;
}

const CreateOrganisation = ({ sidebarOpen, isMobile }: CreateOrganisationProps) => {
   

    return (
        <div >
            organisation------------------------------------------------- create
        </div>
    );
};

export default CreateOrganisation;