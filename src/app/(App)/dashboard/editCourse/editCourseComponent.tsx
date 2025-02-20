'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Button, Container, Row, Col, Accordion } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/auth-context';
import axios from 'axios';

// Import styles // WE USE THE SAME STYLING AS THE CREATE COURSE!!!
import styles from '@/app/(App)/_styles/dashboard/createCourseComponent.module.scss';

// Validation schema
const courseSchema = yup.object().shape({
	title: yup.string().required('Course title is required'),
	shortDescription: yup.string().required('Short description is required'),
	description: yup.string(),
	price: yup.number().positive('Price must be a positive number').nullable(),
	level: yup.string().oneOf(['beginner', 'intermediate', 'advanced'], 'Invalid course level'),
	prerequisites: yup.string(),
	objectives: yup.string(),
	language: yup.string(),
	certificateAvailable: yup.boolean(),
	featured: yup.boolean(),
	publishStatus: yup.string().required()

});

// Main component
const EditCourseComponent = () => {
	const [tags, setTags] = useState<any>([]);
	const [newTag, setNewTag] = useState<any>('');
	const { user, isAuthenticated, getToken } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const courseId: any = searchParams.get('courseId');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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
			price: 0,
			level: 'beginner',
			prerequisites: '',
			objectives: '',
			language: 'English',
			certificateAvailable: false,
			featured: false,
		},
	});

	// Fetch course data
	const fetchCourseData = useCallback(async () => {
		try {
			const token = await getToken();
			if (!token || !courseId) {
				// console.log(token)
				// console.log(courseId)
				router.push('/dashboard');
				return;
			}

			console.log('everything is ok for now');

			// fetch the desired course: BACKEND WORK NEEDED!!!!!
			const response = await axios.get(`/api/courses/getOne/${courseId}`);
			console.log(response);

			if (response.status === 200) {
				const courseData = response.data.data;
				reset({
					title: courseData.title,
					shortDescription: courseData.shortDescription,
					description: courseData.description,
					price: courseData.price,
					level: courseData.level,
					prerequisites: courseData.prerequisites,
					objectives: courseData.objectives,
					language: courseData.language,
					certificateAvailable: courseData.certificateAvailable,
					featured: courseData.featured,
				});
				setTags(courseData.tags || []);
			} else {
				router.push('/dashboard');
			}
		} catch (error) {
			console.error('Error fetching course data:', error);
			setError('Failed to load course data');
			router.push('/dashboard');
		} finally {
			setLoading(false);
		}
	}, [courseId, router, getToken, reset]);

	// Submit updated course data
	const onSubmit = async (data: any) => {
		try {
			const token = await getToken();
			if (!token) {
				router.push('/signin');
				return;
			}

			const updatedData = {
				...data,
				tags: JSON.stringify(tags),
				lastUpdated: new Date().toISOString(),
			};

			const response = await axios.put(`/api/courses/${courseId}`, updatedData, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.status === 200) {
				router.push('/dashboard');
			}
		} catch (error) {
			console.error('Error updating course:', error);
		}
	};

	const addTag = () => {
		if (newTag && !tags.includes(newTag)) {
			setTags([...tags, newTag]);
			setNewTag('');
		}
	};

	const removeTag = (tagToRemove: any) => {
		setTags(tags.filter((tag:any) => tag !== tagToRemove));
	};

	useEffect(() => {
		if (isAuthenticated && courseId) {
			// console.log(isAuthenticated)
			fetchCourseData();
		} else if (!isAuthenticated) {
			router.push('/signin');
		}
	}, [isAuthenticated, courseId, fetchCourseData, router]);

	// handle edit course: route to where they can edit the course:
	const handleCreateLesson = (courseId: number) => {
		router.push(`/dashboard/createLesson?courseId=${courseId}`);
	};

	if (loading) return <div>Loading...</div>;

	return (
		<div>
			<Container className={styles.container}>
				<h2 className="my-4">Edit Course</h2>
				<Button
					variant="dark"
					onClick={() => {
						router.push('/dashboard');
					}}
				>
					Back to Dashboard
				</Button>

				<Accordion>
					<Accordion.Item eventKey="0">
						<Accordion.Header>EDIT COURSE CONTENTS</Accordion.Header>
						<Accordion.Body>
							<Form onSubmit={handleSubmit(onSubmit)} className="mt-4">
								{/* Reuse the form fields from the CreateCourseComponent */}
								{/* Populate default values using the fetched course data */}
								{/* Example field */}
								<Form.Group className="mb-3">
									<Form.Label>Course Title</Form.Label>
									<Controller
										name="title"
										control={control}
										render={({ field }) => (
											<Form.Control
												{...field}
												isInvalid={!!errors.title}
												placeholder="Enter course title"
											/>
										)}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.title?.message}
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Label className={styles.label}>Course Level</Form.Label>
									<Controller
										name="level"
										control={control}
										render={({ field }) => (
											<Form.Select className={styles.controller} {...field}>
												<option value="beginner">Beginner</option>
												<option value="intermediate">Intermediate</option>
												<option value="advanced">Advanced</option>
											</Form.Select>
										)}
									/>
								</Form.Group>

								{/* I have ommited the organisation name because we already know which organisation this course belongs to. */}
								{/* The instructor knows this info as well. */}

								<Form.Group className="mb-3">
									<Form.Label className={styles.label}>
										Short Description *
									</Form.Label>
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
									<Form.Control.Feedback
										type="invalid"
										className={styles.formFeedback}
									>
										{errors.shortDescription?.message}
									</Form.Control.Feedback>
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label className={styles.label}>
										Full Description
									</Form.Label>
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
								<Form.Group className="mb-3">
									<Form.Label className={styles.label}>Price</Form.Label>
									<Controller
										name="price"
										control={control}
										render={({ field }:any) => (
											<Form.Control
												className={styles.controller}
												{...field}
												type="number"
												isInvalid={!!errors.price}
												placeholder="Course price"
											/>
										)}
									/>
									<Form.Control.Feedback
										type="invalid"
										className={styles.formFeedback}
									>
										{errors.price?.message}
									</Form.Control.Feedback>
								</Form.Group>
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
									<Form.Control.Feedback
										type="invalid"
										className={styles.formFeedback}
									>
										{errors.language?.message}
									</Form.Control.Feedback>
								</Form.Group>

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
									<Form.Label className={styles.label}>
										Learning Objectives
									</Form.Label>
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

								{/* <Form.Group className="mb-3">
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
							{tags ? (
								tags.map((tag) => (
									<Button
										key={tag}
										variant="outline-primary"
										size="sm"
										className="me-2 mb-2"
										onClick={() => removeTag(tag)}
									>
										{tag} ×
									</Button>
								))
							): <></> }
						</div> 
					</Form.Group>*/}
								<Form.Group className="mb-3">
									<Form.Label className={styles.label}>
										Additional Options
									</Form.Label>
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
								<Form.Group className="mb-3">
									<Form.Label className={styles.label}>Publish Status</Form.Label>
									<Controller
										name="publishStatus"
										control={control}
										render={({ field }:any) => (
											<div>
												{['draft', 'published', 'archived'].map(
													(status) => (
														<Form.Check
															key={status}
															type="radio"
															label={
																status.charAt(0).toUpperCase() +
																status.slice(1)
															}
															value={status}
															checked={field.value === status}
															onChange={() => field.onChange(status)}
															className={styles.controllerCheck}
														/>
													)
												)}
											</div>
										)}
									/>
								</Form.Group>

								{/* Add other form fields like shortDescription, tags, etc., similar to CreateCourseComponent */}

								<hr />
								{/* Save/Cancel buttons */}
								<div className="d-flex justify-content-end mt-4">
									<Button
										variant="secondary"
										onClick={() => router.push('/dashboard')}
										className="me-2"
									>
										<FaTimes className="me-2" /> Cancel
									</Button>
									<Button type="submit" variant="primary">
										<FaSave className="me-2" /> Update Course
									</Button>
								</div>
							</Form>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="1">
						<Accordion.Header>EDIT LESSON CONTENTS</Accordion.Header>
						<Accordion.Body>
							<Container>
								<Button
									onClick={() => {
										handleCreateLesson(courseId);
									}}
								>
									Create a lesson!
								</Button>
							</Container>
							<Container>
								<h4>This is where you will be able to see and delete lessons:</h4>
							</Container>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Container>
		</div>
	);
};

export default EditCourseComponent;
