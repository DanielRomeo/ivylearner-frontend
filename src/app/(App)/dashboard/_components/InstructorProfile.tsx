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
	FaPlus,
} from 'react-icons/fa';
import styles from '../_styles/InstructorProfile.module.scss';
import { useAuth } from '@/app/contexts/auth-context';

interface InstructorProfileProps {
	sidebarOpen?: boolean;
	isMobile?: boolean;
}

const InstructorProfile = ({ sidebarOpen, isMobile }: InstructorProfileProps) => {
	const { user } = useAuth();
	const [editing, setEditing] = useState(false);
	const [formData, setFormData] = useState({
		firstName: 'John',
		lastName: 'Doe',
		email: user?.email || 'john.doe@example.com',
		timezone: 'Africa/Johannesburg',
		country: 'ZA',
		bio: 'Passionate educator with years of experience in software development and teaching.',
		expertise: ['JavaScript', 'React', 'Node.js', 'Python'],
		yearsExperience: 8,
		teachingStyle: 'Interactive and hands-on approach with real-world projects',
		certifications: [
			{ name: 'AWS Certified Solutions Architect', issuer: 'Amazon', date: '2022' },
			{ name: 'Certified Scrum Master', issuer: 'Scrum Alliance', date: '2021' },
		],
	});

	const [newExpertise, setNewExpertise] = useState('');
	const [newCertification, setNewCertification] = useState({ name: '', issuer: '', date: '' });

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleAddExpertise = () => {
		if (newExpertise.trim()) {
			setFormData({
				...formData,
				expertise: [...formData.expertise, newExpertise.trim()],
			});
			setNewExpertise('');
		}
	};

	const handleRemoveExpertise = (index: number) => {
		setFormData({
			...formData,
			expertise: formData.expertise.filter((_, i) => i !== index),
		});
	};

	const handleAddCertification = () => {
		if (newCertification.name && newCertification.issuer) {
			setFormData({
				...formData,
				certifications: [...formData.certifications, newCertification],
			});
			setNewCertification({ name: '', issuer: '', date: '' });
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Save to API
		setEditing(false);
		console.log('Saved:', formData);
	};

	return (
		<div
			className={`${styles.profilePage} ${sidebarOpen && !isMobile ? styles.sidebarOpen : styles.sidebarClosed}`}
		>
			<div className={styles.header}>
				<h1>Instructor Profile</h1>
				<p>Manage your teaching profile and credentials</p>
			</div>

			<Row className="g-4">
				{/* Left Column - Avatar & Stats */}
				<Col lg={4}>
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
							<p className={styles.userRole}>Instructor</p>

							<div className={styles.stats}>
								<div className={styles.statItem}>
									<h4>8</h4>
									<p>Courses</p>
								</div>
								<div className={styles.statItem}>
									<h4>342</h4>
									<p>Students</p>
								</div>
								<div className={styles.statItem}>
									<h4>4.7</h4>
									<p>Rating</p>
								</div>
							</div>
						</Card.Body>
					</Card>

					<Card className={styles.infoCard}>
						<Card.Body>
							<h5>Teaching Stats</h5>
							<div className={styles.statusItem}>
								<span className={styles.statusLabel}>Member Since</span>
								<span className={styles.statusValue}>Jan 2020</span>
							</div>
							<div className={styles.statusItem}>
								<span className={styles.statusLabel}>Total Revenue</span>
								<span className={`${styles.statusValue} ${styles.premium}`}>
									$15,420
								</span>
							</div>
							<div className={styles.statusItem}>
								<span className={styles.statusLabel}>Status</span>
								<span className={`${styles.statusValue} ${styles.active}`}>
									Active
								</span>
							</div>
							<div className={styles.statusItem}>
								<span className={styles.statusLabel}>Experience</span>
								<span className={styles.statusValue}>
									{formData.yearsExperience} years
								</span>
							</div>
						</Card.Body>
					</Card>
				</Col>

				{/* Right Column - Edit Form */}
				<Col lg={8}>
					<Card className={styles.formCard}>
						<Card.Body>
							<div className={styles.cardHeader}>
								<h4>Personal Information</h4>
								{!editing ? (
									<Button
										className={styles.editBtn}
										onClick={() => setEditing(true)}
									>
										<FaEdit /> Edit Profile
									</Button>
								) : (
									<div className={styles.actionBtns}>
										<Button
											variant="outline-secondary"
											onClick={() => setEditing(false)}
										>
											Cancel
										</Button>
										<Button className={styles.saveBtn} onClick={handleSubmit}>
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
												<FaClock /> Timezone
											</Form.Label>
											<Form.Select
												name="timezone"
												value={formData.timezone}
												onChange={handleChange}
												disabled={!editing}
												className={styles.input}
											>
												<option value="Africa/Johannesburg">
													Africa/Johannesburg (SAST)
												</option>
												<option value="America/New_York">
													America/New York (EST)
												</option>
												<option value="Europe/London">
													Europe/London (GMT)
												</option>
												<option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
											</Form.Select>
										</Form.Group>
									</Col>
									<Col md={6}>
										<Form.Group className="mb-4">
											<Form.Label className={styles.label}>
												<FaGlobe /> Country
											</Form.Label>
											<Form.Control
												type="text"
												name="country"
												value={formData.country}
												onChange={handleChange}
												disabled={!editing}
												className={styles.input}
											/>
										</Form.Group>
									</Col>
								</Row>

								<Form.Group className="mb-4">
									<Form.Label className={styles.label}>
										<FaBriefcase /> Bio
									</Form.Label>
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

								<Form.Group className="mb-4">
									<Form.Label className={styles.label}>
										<FaChalkboardTeacher /> Teaching Style
									</Form.Label>
									<Form.Control
										as="textarea"
										rows={3}
										name="teachingStyle"
										value={formData.teachingStyle}
										onChange={handleChange}
										disabled={!editing}
										className={styles.input}
									/>
								</Form.Group>
							</Form>
						</Card.Body>
					</Card>

					{/* Expertise Section */}
					<Card className={styles.formCard}>
						<Card.Body>
							<div className={styles.cardHeader}>
								<h4>Areas of Expertise</h4>
							</div>

							<div className={styles.expertiseList}>
								{formData.expertise.map((skill, index) => (
									<Badge key={index} className={styles.expertiseBadge}>
										{skill}
										{editing && (
											<button
												onClick={() => handleRemoveExpertise(index)}
												className={styles.removeBadge}
											>
												×
											</button>
										)}
									</Badge>
								))}
							</div>

							{editing && (
								<div className={styles.addExpertise}>
									<Form.Control
										type="text"
										placeholder="Add new expertise..."
										value={newExpertise}
										onChange={(e) => setNewExpertise(e.target.value)}
										className={styles.input}
										onKeyPress={(e) =>
											e.key === 'Enter' &&
											(e.preventDefault(), handleAddExpertise())
										}
									/>
									<Button className={styles.addBtn} onClick={handleAddExpertise}>
										<FaPlus /> Add
									</Button>
								</div>
							)}
						</Card.Body>
					</Card>

					{/* Certifications Section */}
					<Card className={styles.formCard}>
						<Card.Body>
							<div className={styles.cardHeader}>
								<h4>Certifications</h4>
							</div>

							<div className={styles.certificationsList}>
								{formData.certifications.map((cert, index) => (
									<div key={index} className={styles.certificationItem}>
										<div className={styles.certIcon}>
											<FaAward />
										</div>
										<div className={styles.certDetails}>
											<h5>{cert.name}</h5>
											<p>
												{cert.issuer} {cert.date && `• ${cert.date}`}
											</p>
										</div>
									</div>
								))}
							</div>

							{editing && (
								<div className={styles.addCertification}>
									<Row>
										<Col md={5}>
											<Form.Control
												type="text"
												placeholder="Certification name"
												value={newCertification.name}
												onChange={(e) =>
													setNewCertification({
														...newCertification,
														name: e.target.value,
													})
												}
												className={styles.input}
											/>
										</Col>
										<Col md={4}>
											<Form.Control
												type="text"
												placeholder="Issuer"
												value={newCertification.issuer}
												onChange={(e) =>
													setNewCertification({
														...newCertification,
														issuer: e.target.value,
													})
												}
												className={styles.input}
											/>
										</Col>
										<Col md={2}>
											<Form.Control
												type="text"
												placeholder="Year"
												value={newCertification.date}
												onChange={(e) =>
													setNewCertification({
														...newCertification,
														date: e.target.value,
													})
												}
												className={styles.input}
											/>
										</Col>
										<Col md={1}>
											<Button
												className={styles.addBtn}
												onClick={handleAddCertification}
											>
												<FaPlus />
											</Button>
										</Col>
									</Row>
								</div>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default InstructorProfile;
