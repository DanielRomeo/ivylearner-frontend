'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Form, Button, Container, Row, Col, InputGroup, Card } from 'react-bootstrap';
import styles from '../../_styles/addressComponent.module.scss';
import ResponsiveImage from '../../_components/ResponsiveImage';
import { Order } from '../../_components/Interfaces';
import { orderExample } from '../../_components/InterfacesExamples';
import ShowOrderModal from './showOrderModal';
import ColoredTitle from './ColoredTitle';
import EditFormModal from './changeDetailModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';

// Schema:
const schema = yup.object().shape({
	name: yup.string().required('Recipient name is required.'),
	phonenumber: yup.string().required('Phone number is required.'),
	streetaddress: yup.string().required('Street address is required.'),
	complex: yup.string().required('Complex is required.'),
	suburb: yup.string().required('Suburb is required.'),
	city: yup.string().required('City is required.'),
	province: yup.string().required('Province is required.'),
});

//
const BillingAddressComponent = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [orders, setOrders] = useState<Order[]>([...orderExample]);
	const [editField, setEditField] = useState('Address');
	const [userData, setUserData] = useState({
		name: 'Romeo Mamphekgo',
		email: 'RomeoMamphekgo@gmail.com',
		mobileNumber: '+27 67 676 6767',
	});

	// Modal:
	const [showModal, setShowModal] = useState(false);
	const handleClose = () => setShowModal(false);
	const handleShow = () => setShowModal(true);
	const closeModal = () => {
		setShowModal(false);
	};

	// Methods:
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
					<ColoredTitle title={'Address'}></ColoredTitle>

					<Card className={styles.card}>
						<Card.Body>
							<Row className="align-items-center">
								<Col>
									<strong>Recipient name</strong>
									<div>Romeo Mamphekgo</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>

					<Card className={styles.card}>
						<Card.Body>
							<Row className="align-items-center">
								<Col>
									<strong>Recipient phone number</strong>
									<div>+27 67 241 3376</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>

					<Card className={styles.card}>
						<Card.Body>
							<Row className="align-items-center">
								<Col>
									<strong>Street address</strong>
									<div>**************</div>
									<small>Powered by google</small>
								</Col>
							</Row>
						</Card.Body>
					</Card>

					<Card className={styles.card}>
						<Card.Body>
							<Row className="align-items-center">
								<Col>
									<strong>Complex/Building... optional </strong>
									<div>45 Main building, 2nd col</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>

					<Card className={styles.card}>
						<Card.Body>
							<Row className="align-items-center">
								<Col>
									<strong>Suburb </strong>
									<div>Fauna park</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>

					<Card className={styles.card}>
						<Card.Body>
							<Row className="align-items-center">
								<Col>
									<strong>City</strong>
									<div>Pretoria</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>

					<Card className={styles.card}>
						<Card.Body>
							<Row className="align-items-center">
								<Col>
									<strong>Province</strong>
									<div>Gauteng</div>
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
						Edit address details
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
						{errors.name && (
							<span className={`${styles.errorMessage} errorMessage`}>
								{errors.name.message}
							</span>
						)}
						<Form.Group className={styles.formGroup}>
							<Form.Label htmlFor="input1">Recipient Name</Form.Label>
							<Form.Control
								className={styles.inputField}
								type="text"
								{...register('name')}
								onChange={(e) => setValue(e.target.value)}
							/>
						</Form.Group>

						{errors.phonenumber && (
							<span className={`${styles.phonenumber} errorMessage`}>
								{errors.phonenumber.message}
							</span>
						)}
						<Form.Group className={styles.formGroup}>
							<Form.Label htmlFor="input1">Recipient Phone number</Form.Label>
							<Form.Control
								className={styles.inputField}
								type="text"
								{...register('phonenumber')}
								onChange={(e) => setValue(e.target.value)}
							/>
						</Form.Group>

						{errors.streetaddress && (
							<span className={`${styles.errorMessage} errorMessage`}>
								{errors.streetaddress.message}
							</span>
						)}
						<Form.Group className={styles.formGroup}>
							<Form.Label htmlFor="input1">Street address</Form.Label>

							<Form.Control
								className={styles.inputField}
								type="text"
								{...register('streetaddress')}
								onChange={(e) => setValue(e.target.value)}
							/>
						</Form.Group>

						{errors.complex && (
							<span className={`${styles.errorMessage} errorMessage`}>
								{errors.complex.message}
							</span>
						)}
						<Form.Group className={styles.formGroup}>
							<Form.Label htmlFor="input1">Complex/Building</Form.Label>

							<Form.Control
								className={styles.inputField}
								type="text"
								{...register('complex')}
								onChange={(e) => setValue(e.target.value)}
							/>
						</Form.Group>

						{errors.suburb && (
							<span className={`${styles.errorMessage} errorMessage`}>
								{errors.suburb.message}
							</span>
						)}
						<Form.Group className={styles.formGroup}>
							<Form.Label htmlFor="input1">Suburb</Form.Label>

							<Form.Control
								className={styles.inputField}
								type="text"
								{...register('suburb')}
								onChange={(e) => setValue(e.target.value)}
							/>
						</Form.Group>

						{errors.city && (
							<span className={`${styles.errorMessage} errorMessage`}>
								{errors.city.message}
							</span>
						)}
						<Form.Group className={styles.formGroup}>
							<Form.Label htmlFor="input1">City</Form.Label>

							<Form.Control
								className={styles.inputField}
								type="text"
								{...register('city')}
								onChange={(e) => setValue(e.target.value)}
							/>
						</Form.Group>

						{errors.province && (
							<span className={`${styles.errorMessage} errorMessage`}>
								{errors.province.message}
							</span>
						)}
						<Form.Group className={styles.formGroup}>
							<Form.Label htmlFor="input1">Province</Form.Label>

							<Form.Control
								className={styles.inputField}
								type="text"
								{...register('province')}
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

export default BillingAddressComponent;
