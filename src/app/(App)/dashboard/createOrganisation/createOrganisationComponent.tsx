'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';
import {useRouter} from 'next/navigation'

// Validation schema
const organisationSchema = yup.object().shape({
	name: yup.string().required('Organisation name is required'),
	description: yup.string(),
	shortDescription: yup.string(),
	website: yup.string().url('Must be a valid URL'),
	email: yup.string().email('Must be a valid email'),
	phone: yup.string(),
	address: yup.string(),
	socialMedia: yup.object().shape({
		facebook: yup.string().url('Must be a valid URL'),
		twitter: yup.string().url('Must be a valid URL'),
		linkedin: yup.string().url('Must be a valid URL'),
	}),
	foundedYear: yup
		.number()
		.positive('Founded year must be a positive number')
		.integer('Founded year must be an integer')
		.min(1800, 'Founded year must be after 1800')
		.max(new Date().getFullYear(), 'Founded year cannot be in the future')
		.nullable(),
});

const CreateOrganisationComponent = () => {
	const router = useRouter();
	const [socialMediaLinks, setSocialMediaLinks] = useState({
		facebook: '',
		twitter: '',
		linkedin: '',
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(organisationSchema),
		defaultValues: {
			name: '',
			description: '',
			shortDescription: '',
			website: '',
			email: '',
			phone: '',
			address: '',
			foundedYear: null,
		},
	});

	const onSubmit = async (data: any) => {
		try {
			// Combine social media links into a JSON string
			const socialMediaJson = JSON.stringify(socialMediaLinks);

			const finalData = {
				...data,
				socialMedia: socialMediaJson,
				// Assuming createdBy would be set from current user context
				createdBy: 1, // Replace with actual user ID
			};

			// TODO: Implement API call to create organisation
			console.log('Organisation Data:', finalData);

			// Reset form after successful submission
			reset();
			setSocialMediaLinks({ facebook: '', twitter: '', linkedin: '' });
		} catch (error) {
			console.error('Error creating organisation:', error);
		}
	};

	return (
		<Container>
			<h2 className="my-4">Create Organisation</h2>
			<Button variant='dark' onClick={()=>{router.push('/dashboard')}}>Back to Dashboard</Button>
			<br />
			<br />
			<br/>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row>
					<Col md={6}>
						<Form.Group className="mb-3">
							<Form.Label>Organisation Name *</Form.Label>
							<Controller
								name="name"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										isInvalid={!!errors.name}
										placeholder="Enter organisation name"
									/>
								)}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.name?.message}
							</Form.Control.Feedback>
						</Form.Group>
					</Col>
					<Col md={6}>
						<Form.Group className="mb-3">
							<Form.Label>Founded Year</Form.Label>
							<Controller
								name="foundedYear"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										type="number"
										isInvalid={!!errors.foundedYear}
										placeholder="Enter founding year"
									/>
								)}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.foundedYear?.message}
							</Form.Control.Feedback>
						</Form.Group>
					</Col>
				</Row>

				<Row>
					<Col md={6}>
						<Form.Group className="mb-3">
							<Form.Label>Short Description</Form.Label>
							<Controller
								name="shortDescription"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										as="textarea"
										placeholder="Enter a brief description"
									/>
								)}
							/>
						</Form.Group>
					</Col>
					<Col md={6}>
						<Form.Group className="mb-3">
							<Form.Label>Full Description</Form.Label>
							<Controller
								name="description"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										as="textarea"
										placeholder="Enter detailed description"
									/>
								)}
							/>
						</Form.Group>
					</Col>
				</Row>

				<Row>
					<Col md={4}>
						<Form.Group className="mb-3">
							<Form.Label>Website</Form.Label>
							<Controller
								name="website"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										isInvalid={!!errors.website}
										placeholder="https://www.example.com"
									/>
								)}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.website?.message}
							</Form.Control.Feedback>
						</Form.Group>
					</Col>
					<Col md={4}>
						<Form.Group className="mb-3">
							<Form.Label>Email</Form.Label>
							<Controller
								name="email"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										isInvalid={!!errors.email}
										placeholder="contact@example.com"
									/>
								)}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.email?.message}
							</Form.Control.Feedback>
						</Form.Group>
					</Col>
					<Col md={4}>
						<Form.Group className="mb-3">
							<Form.Label>Phone</Form.Label>
							<Controller
								name="phone"
								control={control}
								render={({ field }) => (
									<Form.Control {...field} placeholder="+1 (123) 456-7890" />
								)}
							/>
						</Form.Group>
					</Col>
				</Row>

				<Form.Group className="mb-3">
					<Form.Label>Address</Form.Label>
					<Controller
						name="address"
						control={control}
						render={({ field }) => (
							<Form.Control {...field} placeholder="Enter full address" />
						)}
					/>
				</Form.Group>

				<h4 className="my-3">Social Media Links</h4>
				<Row>
					{Object.keys(socialMediaLinks).map((platform: any) => (
						<Col md={4} key={platform}>
							<Form.Group className="mb-3">
								<Form.Label>
									{platform.charAt(0).toUpperCase() + platform.slice(1)} URL
								</Form.Label>
								<Form.Control
									value={socialMediaLinks[platform]}
									onChange={(e) =>
										setSocialMediaLinks({
											...socialMediaLinks,
											[platform]: e.target.value,
										})
									}
									placeholder={`https://www.${platform}.com/your-profile`}
								/>
							</Form.Group>
						</Col>
					))}
				</Row>

				<div className="d-flex justify-content-end mt-4">
					<Button variant="secondary" onClick={() => reset()} className="me-2">
						<FaTimes className="me-2" /> Cancel
					</Button>
					<Button type="submit" variant="primary">
						<FaSave className="me-2" /> Save Organisation
					</Button>
				</div>
			</Form>
		</Container>
	);
};

export default CreateOrganisationComponent;
