'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/auth-context';
import Image from 'next/image';
import axios from 'axios';

// import styles:
import styles from '@/app/(App)/_styles/dashboard/createCourseComponent.module.scss';

// Validation schema
const courseSchema = yup.object().shape({
	title: yup.string().required('Course title is required'),
	shortDescription: yup.string().required('Short description is required'),
	description: yup.string(),
	price: yup.number().positive('Price must be a positive number').nullable(),
	// duration: yup
	// 	.number()
	// 	.positive('Duration must be a positive number')
	// 	.integer('Duration must be in whole minutes')
	// 	.nullable(),
	level: yup.string().oneOf(['beginner', 'intermediate', 'advanced'], 'Invalid course level'),
	prerequisites: yup.string(),
	objectives: yup.string(),
	language: yup.string(),
	certificateAvailable: yup.boolean(),
	featured: yup.boolean(),
	thumbnailUrl: yup.string(),
	organisation: yup.string(),
	publishStatus: yup.string().required(),
});

// Types
interface Instructor {
	id: number;
	firstName: string;
	lastName: string;
	profilePicture: string;
	bio: string;
	specialization: string;
}

interface Organization {
	id: number;
	name: string;
	description?: string;
}

// Main component:
const CreateCourseComponent = () => {
	const [tags, setTags] = useState<any>([]);
	const [newTag, setNewTag] = useState<any>('');
	const { user, isAuthenticated, getToken } = useAuth();
	const router = useRouter();
	const [instructor, setInstructor] = useState<Instructor | null>(null);
	const [organization, setOrganization] = useState<Organization | null>(null);

	// thumbnail states:
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
	const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

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

	const addTag = () => {
		if (newTag && !tags.includes(newTag)) {
			setTags([...tags, newTag]);
			setNewTag('');
		}
	};

	const removeTag = (tagToRemove: any) => {
		setTags(tags.filter((tag: any) => tag !== tagToRemove));
	};

	// Thumbnail upload handler
	const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			alert('Please upload an image file');
			return;
		}

		// Validate file size (e.g., 5MB limit)
		if (file.size > 5 * 1024 * 1024) {
			alert('File size should be less than 5MB');
			return;
		}

		setThumbnailFile(file);
		setThumbnailPreview(URL.createObjectURL(file));
	};

	// Upload thumbnail to S3
	const uploadThumbnail = async () => {
		if (!thumbnailFile) return null;

		try {
			setUploadingThumbnail(true);

			// Get presigned URL
			const presignedResponse = await axios.post('/api/courses/thumbnail', {
				fileName: thumbnailFile.name,
				fileType: thumbnailFile.type,
			});

			// Upload to S3
			await axios.put(presignedResponse.data.uploadUrl, thumbnailFile, {
				headers: {
					'Content-Type': thumbnailFile.type,
				},
				// Disable axios from automatically setting headers
				transformRequest: [
					(data, headers) => {
						delete headers['x-amz-checksum-crc32'];
						delete headers['x-amz-sdk-checksum-algorithm'];
						return data;
					},
				],
			});

			return presignedResponse.data.fileUrl;
		} catch (error) {
			console.error('Error uploading thumbnail:', error);
			alert('Failed to upload thumbnail. Please try again.');
			throw error;
		} finally {
			setUploadingThumbnail(false);
		}
	};

	// submission:
	// Updated submit handler
	const onSubmit = async (data: any) => {
		try {
			let thumbnailUrl = null;
			if (thumbnailFile) {
				thumbnailUrl = await uploadThumbnail();
			}

			const finalData = {
				...data,
				thumbnailUrl,
				tags: JSON.stringify(tags),
				organisationId: organization?.id || null,
				createdBy: instructor?.id,
				publishStatus: 'draft',
				publishedAt: null,
				lastUpdated: new Date().toISOString(),
			};

			const response = await axios.post('/api/courses/create', finalData);
			console.log(response.data);
			router.push('/dashboard');
		} catch (error) {
			console.error('Error creating course:', error);
		}
	};

	// fetch instructor data function:
	const fetchInstructorData = useCallback(async () => {
		if (!user?.id) {
			router.push('/signin');
			return;
		}

		try {
			const token = await getToken();
			if (!token) {
				router.push('/signin');
				return;
			}

			// set instructor data and also set the organisation data we wish to uplaod course for:
			const userDetailsId = await axios.get(`/api/userDetails/${user.id}`);
			const response = await axios.get(`/api/instructors/${userDetailsId.data.userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.status === 200) {
				setInstructor(response.data.data);
				console.log(response.data.data);
				let InstructorId = response.data.data.id;

				// set organisation data:
				const response2 = await axios.get(`/api/organisations/first/${InstructorId}`);
				setOrganization(response2.data);
				// console.log(user.id)
				// console.log(response2.data)

				setLoading(false);
			} else if (response.status === 404) {
				router.push('/onboarding');
			}
		} catch (error: any) {
			console.error('Error fetching instructor data:', error);
			setError('Failed to load instructor data');
			setLoading(false);

			if (error.response?.status === 401) {
				router.push('/signin');
			}
		}
	}, [user?.id, router, getToken]);

	// useEffect:
	useEffect(() => {
		if (isAuthenticated === false) {
			router.push('/signin');
			return;
		}

		if (isAuthenticated === true) {
			fetchInstructorData();
		}
	}, [isAuthenticated, fetchInstructorData, router]);

	return (
		<div>
			<Container className={styles.container}>
				<h2 className="my-4">Create Course</h2>
				<Button
					variant="dark"
					onClick={() => {
						router.push('/dashboard');
					}}
				>
					Back to Dashboard
				</Button>

				<br />
				<br />
				<br />

				<Form onSubmit={handleSubmit(onSubmit)}>
					{/* Thumbnail row */}
					<Row className="mb-4">
						<Col md={6}>
							<Form.Group>
								<Form.Label className={styles.label}>Course Thumbnail</Form.Label>
								<div className="d-flex flex-column">
									{thumbnailPreview && (
										<div className="mb-3">
											<Image
												src={thumbnailPreview}
												alt="Thumbnail preview"
												style={{ maxWidth: '200px', maxHeight: '200px' }}
												width={100}
												height={100}
												// thumbnail
											/>
										</div>
									)}
									<div className="d-flex align-items-center">
										<Form.Control
											type="file"
											accept="image/*"
											onChange={handleThumbnailChange}
											className={styles.controller}
										/>
										{uploadingThumbnail && (
											<span className="ms-2">Uploading...</span>
										)}
									</div>
								</div>
							</Form.Group>
						</Col>
					</Row>
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
								<Form.Control.Feedback
									type="invalid"
									className={styles.formFeedback}
								>
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
										<Form.Select className={styles.controller} {...field}>
											<option value="beginner">Beginner</option>
											<option value="intermediate">Intermediate</option>
											<option value="advanced">Advanced</option>
										</Form.Select>
									)}
								/>
							</Form.Group>
						</Col>
					</Row>

					{/* The organisation that they are creating a course for: */}
					<Row>
						<Col md={12}>
							<Form.Group className="mb-3">
								<Form.Label className={styles.label}>Organisation</Form.Label>

								<Form.Control
									className={styles.controller}
									placeholder=""
									readOnly // This makes the field non-editable
									value={organization?.name || ''} // Populate with fetched organization name
								/>

								<Form.Control.Feedback
									type="invalid"
									className={styles.formFeedback}
								>
									{errors.organisation?.message}
								</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>

					<Row>
						<Col md={6}>
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
											{...{
												...field,
												value: field.value ?? '', // Convert null to empty string
											}}
											type="number"
											isInvalid={!!errors.price}
											placeholder="Enter price"
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
						</Col>

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
								<Form.Control.Feedback
									type="invalid"
									className={styles.formFeedback}
								>
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
									{tags.map((tag: any) => (
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
					<hr />
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
													label={
														status.charAt(0).toUpperCase() +
														status.slice(1)
													}
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
