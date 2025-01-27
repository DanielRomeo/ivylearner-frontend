'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Form, Button, ProgressBar, Container } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/app/(App)/_styles/dashboard/createCourseComponent.module.scss';

import S3FileUpload from 'react-s3';

// Validation schema for lesson creation
const lessonSchema = yup.object().shape({
	title: yup.string().required('Lesson title is required'),
	description: yup.string().required('Description is required'),
	videoFile: yup
		.mixed()
		.test('fileRequired', 'Video file is required', (value) => value && value.length > 0),
});

// AWS S3 configuration using environment variables
const s3Config = {
	bucketName: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
	dirName: process.env.NEXT_PUBLIC_AWS_S3_DIR_NAME || '', // Optional directory
	region: process.env.NEXT_PUBLIC_AWS_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Only accessible on the server
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Only accessible on the server
};

const CreateLessonComponent = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(lessonSchema),
	});

	const router = useRouter();
	const searchParams = useSearchParams();
	const courseId = searchParams.get('courseId');

	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const onSubmit = async (data: any) => {
		try {
			if (!courseId) {
				router.push('/dashboard');
				return;
			}

			setUploading(true);
			setError(null);

			// Upload video file to S3
			const file = data.videoFile[0];
			const s3Response = await S3FileUpload.uploadFile(file, s3Config);

			// If successful, store lesson metadata in the database
			const lessonData = {
				title: data.title,
				description: data.description,
				videoUrl: s3Response.location, // S3 file URL
			};

			const response = await axios.post(`/api/lessons/upload/${courseId}`, lessonData);

			if (response.status === 200) {
				router.push(`/dashboard/courseDetails?courseId=${courseId}`);
			}
		} catch (err) {
			console.error('Error uploading lesson:', err);
			setError('Failed to upload lesson. Please try again.');
		} finally {
			setUploading(false);
			setUploadProgress(0);
			reset();
		}
	};

	return (
		<Container className={styles.createLesson}>
			<h2>Create New Lesson</h2>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Form.Group className="mb-3">
					<Form.Label>Lesson Title</Form.Label>
					<Controller
						name="title"
						control={control}
						render={({ field }) => <Form.Control type="text" {...field} />}
					/>
					{errors.title && <p className="text-danger">{errors.title.message}</p>}
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Description</Form.Label>
					<Controller
						name="description"
						control={control}
						render={({ field }) => <Form.Control as="textarea" rows={3} {...field} />}
					/>
					{errors.description && (
						<p className="text-danger">{errors.description.message}</p>
					)}
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Video File</Form.Label>
					<Controller
						name="videoFile"
						control={control}
						render={({ field }) => (
							<Form.Control
								type="file"
								onChange={(e) => {
									const files = e.target.files;
									if (files && files.length > 0) {
										field.onChange(files); // Pass the FileList object to react-hook-form
									} else {
										field.onChange(null); // Handle case where no file is selected
									}
								}}
							/>
						)}
					/>
					{errors.videoFile && <p className="text-danger">{errors.videoFile.message}</p>}
				</Form.Group>

				{uploading && (
					<ProgressBar
						animated
						now={uploadProgress}
						label={`${uploadProgress}%`}
						className="mb-3"
					/>
				)}

				{error && <p className="text-danger">{error}</p>}

				<Button type="submit" disabled={uploading}>
					{uploading ? 'Uploading...' : 'Create Lesson'}
				</Button>
			</Form>
		</Container>
	);
};

export default CreateLessonComponent;
