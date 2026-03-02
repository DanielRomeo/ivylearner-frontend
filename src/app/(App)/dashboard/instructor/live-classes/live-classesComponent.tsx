'use client';

import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaVideo, FaSpinner, FaBroadcastTower } from 'react-icons/fa';
// import styles from '../../_styles/dashboard/instructor/liveClasses.module.scss';
// import CreateLiveRoomModal from '../../live/[roomId]/components/CreateLiveRoomModal';
import CreateLiveRoomModal from '../../../live/[roomId]/components/CreateLiveRoomModal';

export default function LiveClasses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<{ id: number; title: string } | null>(null);

    
    return (
        <Container >
            <Row className="mb-4">
            </Row>
            <Row>
                <Col>
                    <h2>Live Classes</h2>
                    <p>Manage your live classes and sessions here.</p>

                    {/* Button to trigger the modal */}
                    <Button variant="primary" onClick={() => {
                        setSelectedCourse({ id: 1, title: 'Sample Course' }); // Replace with actual course selection logic
                        setShowCreateModal(true);

                        
                    }}>
                        <FaVideo className="me-2" />
                        Create Live Class
                    </Button>

                    {/* // call createliveroommodal */}
                    <CreateLiveRoomModal
                        courseId={selectedCourse?.id || 0}
                        courseTitle={selectedCourse?.title || ''}
                        show={showCreateModal}
                        onHide={() => setShowCreateModal(false)}
                    />
                </Col>
            </Row>
        </Container>
    );
}   