'use client';

import React,{ useState , useEffect} from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaSave } from 'react-icons/fa';
// import styles from '../_styles/InstructorProfile.module.scss';
import styles from '../_styles/InstructorProfile.module.scss';
import { useAuth } from '@/app/contexts/auth-context';

interface InstructorProfileProps {
    sidebarOpen?: boolean;
    isMobile?: boolean;
}

const InstructorProfile = ({ sidebarOpen, isMobile }: InstructorProfileProps) => {
    //  const [sidebarOpen, setSidebarOpen] = useState(true);
    // const [isMobile, setIsMobile] = useState(false);
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    // const [isMobile, setIsMobile] = useState(false); // RESIZING STATE
    //     const [sidebarOpen, setSidebarOpen] = useState(true); // RESIZING STATE
    const [formData, setFormData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: user?.email || 'john.doe@example.com',
        phone: '+1 234 567 8900',
        location: 'New York, USA',
        bio: 'Passionate learner exploring new technologies and skills.',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Save to API
        setEditing(false);
        console.log('Saved:', formData);
    };

    // useEffect(() => {
    //     const handleResize = () => {
    //         const mobile = window.innerWidth <= 1678;
    //         setIsMobile(mobile);
    //         if (mobile) {
    //             setSidebarOpen(false);
    //         } else {
    //             setSidebarOpen(true);
    //         }
    //     };

    //     handleResize();
    //     window.addEventListener('resize', handleResize);
    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);
   


    return (
        <div className={`${styles.profilePage} ${sidebarOpen && !isMobile ? styles.sidebarOpen : styles.sidebarClosed}`}>
        {/* <div className={styles.profilePage}> */}
            <div className={styles.header}>
                <h1>My Profile</h1>
                <p>Manage your account settings and preferences</p>
            </div>

            <Row className="g-4">
               

                <Col xl={4} lg={12}>
                    <Card className={styles.avatarCard}>
                        <Card.Body className="text-center">
                            <div className={styles.avatarContainer}>
                                <div className={styles.avatar}>
                                    <FaUser size={80} />
                                </div>
                                <button className={styles.uploadBtn}>
                                    <FaCamera />
                                </button>
                            </div>

                            <h3 className={styles.userName}>
                                {formData.firstName} {formData.lastName}
                            </h3>
                            <p className={styles.userRole}>Student</p>

                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <h4>12</h4>
                                    <p>Courses</p>
                                </div>
                                <div className={styles.statItem}>
                                    <h4>5</h4>
                                    <p>Completed</p>
                                </div>
                                <div className={styles.statItem}>
                                    <h4>3</h4>
                                    <p>Certificates</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className={styles.infoCard}>
                        <Card.Body>
                            <h5>Account Status</h5>
                            <div className={styles.statusItem}>
                                <span className={styles.statusLabel}>Member Since</span>
                                <span className={styles.statusValue}>Jan 2024</span>
                            </div>
                            <div className={styles.statusItem}>
                                <span className={styles.statusLabel}>Subscription</span>
                                <span className={`${styles.statusValue} ${styles.premium}`}>
                                    Premium
                                </span>
                            </div>
                            <div className={styles.statusItem}>
                                <span className={styles.statusLabel}>Status</span>
                                <span className={`${styles.statusValue} ${styles.active}`}>
                                    Active
                                </span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Column - Edit Form */}
                <Col xl={8} lg={12}>
                    <Card className={styles.formCard}>
                        <Card.Body>
                            <div className={styles.cardHeader}>
                                <h4>Personal Information</h4>
                                {!editing ? (
                                    <Button
                                        className={styles.editBtn}
                                        onClick={() => setEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <div className={styles.actionBtns}>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => setEditing(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className={styles.saveBtn}
                                            onClick={handleSubmit}
                                        >
                                            <FaSave /> Save Changes
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className={styles.label}>
                                                <FaUser /> First Name
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                disabled={!editing}
                                                className={styles.input}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className={styles.label}>
                                                <FaUser /> Last Name
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                disabled={!editing}
                                                className={styles.input}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label className={styles.label}>
                                        <FaEnvelope /> Email Address
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        className={styles.input}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className={styles.label}>
                                                <FaPhone /> Phone Number
                                            </Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={!editing}
                                                className={styles.input}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className={styles.label}>
                                                <FaMapMarkerAlt /> Location
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                disabled={!editing}
                                                className={styles.input}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label className={styles.label}>Bio</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        className={styles.input}
                                    />
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card className={styles.securityCard}>
                        <Card.Body>
                            <h4>Security Settings</h4>
                            <Button className={styles.changePasswordBtn}>
                                Change Password
                            </Button>
                            <Button variant="outline-danger" className="ms-3">
                                Two-Factor Authentication
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
        // </div>
    );
};

export default InstructorProfile;