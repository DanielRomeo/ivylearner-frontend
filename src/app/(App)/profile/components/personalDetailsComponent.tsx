'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Form, Button, Container, Row, Col, InputGroup, Card } from 'react-bootstrap';
import styles from '../../_styles/personalDetails.module.scss';
import EditFormModal from './changeDetailModal'; // Edit Details Modal
import ColoredTitle from './ColoredTitle';
import ResponsiveImage from '../../_components/ResponsiveImage';
import { Order } from '../../_components/Interfaces';
import { orderExample } from '../../_components/InterfacesExamples';
import ShowOrderModal from './showOrderModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';

// Schema:
const schema = yup.object().shape({
	fullname: yup.string().required('Recipient name is required.'),
	email: yup.string().required('Phone number is required.'),
	password: yup
		.string()
		.required('Password is required.')
		.min(6, 'Password must be at least 6 characters.'),
	confirmPassword: yup
		.string()
		.required('Confirm Password is required.')
		.oneOf([yup.ref('password')], 'Passwords must match.'),
	phonenumber: yup.string().required('Phone number is required.').min(8),
});

const PersonalDetails = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const closeModal = () => {
		setShowModal(false);
	};

	const [showModal, setShowModal] = useState(false);
	const [editField, setEditField] = useState('');
	const [userData, setUserData] = useState({
		name: 'Romeo Mamphekgo',
		email: 'RomeoMamphekgo@gmail.com',
		mobileNumber: '+27 67 676 6767',
	});

	const handleEdit = (field: string) => {
		setEditField(field);
		setShowModal(true);
	};

	const handleSave = (value: string) => {
		setUserData((prevData) => ({
			...prevData,
			[editField]: value,
		}));
		// Here you would typically also send an API request to update the data
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(schema) });

	const onSubmit = (data: any) => {
		console.log(data);
		// Handle form submission here
	};

	// modal data:
	const [value, setValue] = useState('water');

	return (
		<div className={styles.main}>
			<Container className={styles.mainContainer}>
				<Row>
					<ColoredTitle title={'Personal details'}></ColoredTitle>

					<Card className={styles.card}>
						<Card.Body>
							<Row className="align-items-center">
								<Col>
									<strong>Your Name</strong>
									<div>Romeo Mamphekgo</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>

					<Card className={styles.card}>
						<Card.Body>
							<Row className="align-items-center">
								<Col>
									<strong>Email Address</strong>
									<div>RomeoMamphekgo@gmail.com</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>

					<Card className={styles.card}>
						<Card.Body>
							<Row className="align-items-center">
								<Col>
									<strong>Password</strong>
									<div>**************</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>

					<Card className={styles.card}>
						<Card.Body>
							<Row className="align-items-center">
								<Col>
									<strong>Mobile Number</strong>
									<div>+27 67 676 6767</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Row>

				<Row className={styles.editDetailsButtonRow}>
					<Button
						className={styles.editDetailsButton}
						onClick={() => {
							handleEdit('name');
						}}
					>
						Edit Personal details
					</Button>
				</Row>
			</Container>

			{/* MODAL ---------------------------------------------------------- */}
			<EditFormModal
				show={showModal}
				onHide={() => setShowModal(false)}
				onSave={handleSave}
				title={`Edit ${editField}`}
				initialValue={userData[editField as keyof typeof userData]}
				bodyChildren={
					<Form onSubmit={handleSubmit(onSubmit)} className={styles.formModal}>
						{errors.fullname && (
							<span className={`${styles.errorMessage} errorMessage`}>
								{errors.fullname.message}
							</span>
						)}
						<Form.Group className={styles.formGroup}>
							<Form.Label htmlFor="input1">Your full name</Form.Label>
							<Form.Control
								className={styles.inputField}
								type="text"
								{...register('fullname')}
								onChange={(e) => setValue(e.target.value)}
							/>
						</Form.Group>

						{errors.email && (
							<span className={`${styles.email} errorMessage`}>
								{errors.email.message}
							</span>
						)}
						<Form.Group className={styles.formGroup}>
							<Form.Label htmlFor="input1">Email address</Form.Label>
							<Form.Control
								className={styles.inputField}
								type="email"
								{...register('email')}
								onChange={(e) => setValue(e.target.value)}
							/>
						</Form.Group>

						{errors.password && (
							<span className={`${styles.errorMessage} errorMessage`}>
								{errors.password.message}
							</span>
						)}
						<Form.Group className={styles.formGroup}>
							<Form.Label htmlFor="input1">Password</Form.Label>

							<Form.Control
								className={styles.inputField}
								type="password"
								{...register('password')}
								onChange={(e) => setValue(e.target.value)}
							/>
						</Form.Group>

						{errors.confirmPassword && (
							<span className={`${styles.errorMessage} errorMessage`}>
								{errors.confirmPassword.message}
							</span>
						)}
						<Form.Group className={styles.formGroup}>
							<Form.Label htmlFor="input1">Confirm Password</Form.Label>

							<Form.Control
								className={styles.inputField}
								type="password"
								{...register('confirmPassword')}
								onChange={(e) => setValue(e.target.value)}
							/>
						</Form.Group>

						<hr />
						<Button
							className={`${styles.cancelButton} cancelButton`}
							variant="secondary"
							onClick={closeModal}
						>
							Cancel
						</Button>

						<Button
							type="submit"
							className={`${styles.saveButton} saveButton`}
							variant="primary"
						>
							Save Changes
						</Button>
					</Form>
				}
			/>
		</div>
	);
};

export default PersonalDetails;
