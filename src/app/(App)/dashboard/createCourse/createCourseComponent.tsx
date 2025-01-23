'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';

// import styles:
import styles from '@/app/(App)/_styles/dashboard/createCourseComponent.module.scss'

// Validation schema
const courseSchema = yup.object().shape({
	title: yup.string().required('Course title is required'),
	shortDescription: yup.string().required('Short description is required'),
	description: yup.string(),
	price: yup.number().positive('Price must be a positive number').nullable(),
	duration: yup
		.number()
		.positive('Duration must be a positive number')
		.integer('Duration must be in whole minutes')
		.nullable(),
	level: yup.string().oneOf(['beginner', 'intermediate', 'advanced'], 'Invalid course level'),
	prerequisites: yup.string(),
	objectives: yup.string(),
	language: yup.string(),
	certificateAvailable: yup.boolean(),
	featured: yup.boolean(),
});

const CreateCourseComponent = () => {
	const [tags, setTags] = useState([]);
	const [newTag, setNewTag] = useState('');

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(courseSchema),
		defaultValues: {
			title: '',
			shortDescription: '',
			description: '',
			price: null,
			duration: null,
			level: 'beginner',
			prerequisites: '',
			objectives: '',
			language: 'English',
			certificateAvailable: false,
			featured: false,
		},
	});

	const addTag = () => {
		if (newTag && !tags.includes(newTag)) {
			setTags([...tags, newTag]);
			setNewTag('');
		}
	};

	const removeTag = (tagToRemove: any) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const onSubmit = async (data: any) => {
		try {
			const finalData = {
				...data,
				tags: JSON.stringify(tags),
				// Assuming organisationId and createdBy would be set from context
				organisationId: 1, // Replace with actual organisation ID
				createdBy: 1, // Replace with actual user ID
				publishStatus: 'draft',
				publishedAt: null,
				lastUpdated: new Date().toISOString(),
			};

			// TODO: Implement API call to create course
			console.log('Course Data:', finalData);

			// Reset form after successful submission
			reset();
			setTags([]);
		} catch (error) {
			console.error('Error creating course:', error);
		}
	};

	return (
		<div>
			<Container className={styles.container}>
				<h2 className="my-4">Create Course</h2>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Row>
						<Col md={8}>
							<Form.Group className="mb-3">
								<Form.Label className={styles.label}>Course Title *</Form.Label>
								<Controller
									
									name="title"
									control={control}
									render={({ field }) => (
										<Form.Control
										className={styles.controller}
											{...field}
											isInvalid={!!errors.title}
											placeholder="Enter course title"
										/>
									)}
								/>
								<Form.Control.Feedback type="invalid" className={styles.formFeedback}>
									{errors.title?.message}
								</Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col md={4}>
							<Form.Group className="mb-3">
								<Form.Label className={styles.label}>Course Level</Form.Label>
								<Controller
								
									name="level"
									control={control}
									render={({ field }) => (
										<Form.Select
										className={styles.controller}
										{...field}>
											<option value="beginner">Beginner</option>
											<option value="intermediate">Intermediate</option>
											<option value="advanced">Advanced</option>
										</Form.Select>
									)}
								/>
							</Form.Group>
						</Col>
					</Row>

					<Row>
						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label className={styles.label}>Short Description *</Form.Label>
								<Controller
								
									name="shortDescription"
									control={control}
									render={({ field }) => (
										<Form.Control
											{...field}
											className={styles.controller}
											as="textarea"
											isInvalid={!!errors.shortDescription}
											placeholder="Enter a brief course description"
										/>
									)}
								/>
								<Form.Control.Feedback type="invalid" className={styles.formFeedback}>
									{errors.shortDescription?.message}
								</Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label className={styles.label}>Full Description</Form.Label>
								<Controller
								
									name="description"
									control={control}
									render={({ field }) => (
										<Form.Control
										className={styles.controller}
											{...field}
											as="textarea"
											placeholder="Enter detailed course description"
										/>
									)}
								/>
							</Form.Group>
						</Col>
					</Row>

					<Row>
						<Col md={4}>
							<Form.Group className="mb-3">
							<Form.Label className={styles.label}>Price</Form.Label>
							<Controller
								name="price"
								control={control}
								render={({ field }) => (
								<Form.Control 
								className={styles.controller}
									{...field} 
									type="number"
									isInvalid={!!errors.price}
									placeholder="Course price" 
								/>
								)}
							/>
							<Form.Control.Feedback type="invalid" className={styles.formFeedback}>
								{errors.price?.message}
							</Form.Control.Feedback>
							</Form.Group>
						</Col>
						{/* <Col md={4}>
							<Form.Group className="mb-3">
							<Form.Label>Duration (minutes)</Form.Label>
							<Controller
								name="duration"
								control={control}
								render={({ field }) => (
								<Form.Control 
									{...field} 
									type="number"
									isInvalid={!!errors.duration}
									placeholder="Total course duration" 
								/>
								)}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.duration?.message}
							</Form.Control.Feedback>
							</Form.Group>
						</Col> */}

						

						<Col md={4}>
							<Form.Group className="mb-3">
								<Form.Label className={styles.label}>Language</Form.Label>
								<Controller
									name="language"
									control={control}
									render={({ field }) => (
									<Form.Control 
										{...field} 
										className={styles.controller}
										placeholder="Course language" 
									/>
									)}
								/>
								<Form.Control.Feedback type="invalid" className={styles.formFeedback}>
										{errors.language?.message}
									</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>

					<Form.Group className="mb-3">
						<Form.Label className={styles.label}>Prerequisites</Form.Label>
						<Controller
							name="prerequisites"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									as="textarea"
									placeholder="List any prerequisites for this course"
								/>
							)}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label className={styles.label}>Learning Objectives</Form.Label>
						<Controller
							name="objectives"
							control={control}
							render={({ field }) => (
								<Form.Control
								className={styles.controller}
									{...field}
									as="textarea"
									placeholder="What will students learn from this course?"
								/>
							)}
						/>
					</Form.Group>

					<Row>
						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label className={styles.label}>Tags</Form.Label>
								<div className="d-flex">
									<Form.Control
									className={styles.controller}
										value={newTag}
										onChange={(e) => setNewTag(e.target.value)}
										placeholder="Add course tags"
									/>
									<Button variant="secondary" onClick={addTag} className="ms-2">
										Add Tag
									</Button>
								</div>
								<div className="mt-2">
									{tags.map((tag) => (
										<Button
											key={tag}
											variant="outline-primary"
											size="sm"
											className="me-2 mb-2"
											onClick={() => removeTag(tag)}
										>
											{tag} ×
										</Button>
									))}
								</div>
							</Form.Group>
						</Col>

						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label className={styles.label}>Additional Options</Form.Label>
								<div>
									<Controller
										name="certificateAvailable"
										control={control}
										render={({ field: { value, onChange } }) => (
											<Form.Check
											className={styles.controllerCheck}
												type="checkbox"
												label="Certificate Available"
												checked={value}
												onChange={(e) => onChange(e.target.checked)}
											/>
										)}
									/>
									<Controller
										name="featured"
										control={control}
										render={({ field: { value, onChange } }) => (
											<Form.Check
											className={styles.controllerCheck}
												type="checkbox"
												label="Featured Course"
												checked={value}
												onChange={(e) => onChange(e.target.checked)}
											/>
										)}
									/>
								</div>
							</Form.Group>
						</Col>
					</Row>
					<hr/>
					<Row>
						<Col>
							<Form.Group className="mb-3">
								<Form.Label className={styles.label}>Publish Status</Form.Label>
								<Controller
									name="publishStatus"
									control={control}
									render={({ field }) => (
									<div>
										{['draft', 'published', 'archived'].map((status) => (
										<Form.Check
											key={status}
											type="radio"
											label={status.charAt(0).toUpperCase() + status.slice(1)}
											value={status}
											checked={field.value === status}
											onChange={() => field.onChange(status)}
											className={styles.controllerCheck}
										/>
										))}
									</div>
									)}
								/>
							</Form.Group>
						</Col>
					</Row>

					<div className="d-flex justify-content-end mt-4">
						<Button
							variant="secondary"
							onClick={() => {
								reset();
								setTags([]);
							}}
							className="me-2"
						>
							<FaTimes className="me-2" /> Cancel
						</Button>
						<Button type="submit" variant="primary">
							<FaSave className="me-2" /> Save Course
						</Button>
					</div>
				</Form>
			</Container>
		</div>
	);
};

export default CreateCourseComponent;