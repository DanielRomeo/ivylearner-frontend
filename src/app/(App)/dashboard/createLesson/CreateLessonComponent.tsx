'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Form, Button, ProgressBar, Container } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/app/(App)/_styles/dashboard/createCourseComponent.module.scss';
import AlertDismissible from '../../_components/DismissableAlert';

// Validation schema for lesson creation
const lessonSchema = yup.object().shape({
	title: yup.string().required('Lesson title is required'),
	description: yup.string().required('Description is required'),
	videoFile: yup
		.mixed()
		.test('fileRequired', 'Video file is required', (value: any) => value && value.length > 0),
});

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
	const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// submission function:
	const onSubmit = async (data: any) => {
		try {
			if (!courseId) {
				router.push('/dashboard');
				return;
			}

			setUploading(true);
			setError(null);

			const file = data.videoFile[0];
			const fileName = `${Date.now()}-${file.name}`;

			console.log('Uploading file:', {
				name: file.name,
				type: file.type,
				size: file.size,
			});

			// Get pre-signed URL
			const presignedUrlResponse = await axios.post('/api/upload/getPresignedUrl', {
				fileName,
				fileType: file.type,
			});

			const { uploadUrl, fileUrl, contentType } = presignedUrlResponse.data;

			console.log('Got pre-signed URL:', uploadUrl);

			// Create a new axios instance without default headers
			const uploadAxios = axios.create();
			delete uploadAxios.defaults.headers.common['Authorization'];

			// Create a binary blob with the correct content type
			const blob = new Blob([file], { type: contentType });

			// Upload the file using the pre-signed URL
			try {
				const uploadResponse = await uploadAxios.put(uploadUrl, blob, {
					headers: {
						'Content-Type': contentType,
					},
					// Explicitly remove authorization header
					withCredentials: false,
					onUploadProgress: (progressEvent) => {
						const progress = Math.round(
							(progressEvent.loaded * 100) / (progressEvent.total || 1)
						);
						setUploadProgress(progress);
					},
				});

				console.log('Upload response:', uploadResponse);
				setUploadSuccess(true);

				// Store lesson metadata in the database using your regular axios instance
				const lessonData = {
					title: data.title,
					description: data.description,
					videoUrl: fileUrl,
				};
			} catch (uploadError: any) {
				console.error('Error during upload:', uploadError);
				console.error('Upload error response:', uploadError.response?.data);
				throw new Error('Failed to upload file to S3');
			}
		} catch (err) {
			console.error('Error uploading lesson:', err);
			setError('Failed to upload lesson. Please try again.');
			setUploadSuccess(false);
		} finally {
			setUploading(false);
			setUploadProgress(0);
			reset();
		}
	};

	return (
		<Container className={styles.createLesson}>
			<h2>Create New Lesson</h2>
			<AlertDismissible
				type="success"
				heading="Successful upload!"
				message="Successfully uploaded lesson your course!"
			></AlertDismissible>

			<Form onSubmit={handleSubmit(onSubmit)}>
				<Form.Group className="mb-3">
					<Form.Label>Lesson Title</Form.Label>
					<Controller
						name="title"
						control={control}
						defaultValue=""
						render={({ field }) => <Form.Control type="text" {...field} />}
					/>
					{errors.title && <p className="text-danger">{errors.title.message}</p>}
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Description</Form.Label>
					<Controller
						name="description"
						control={control}
						defaultValue=""
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
						// defaultValue={null}
						render={({ field: { onChange, value, ...field } }) => (
							<Form.Control
								type="file"
								onChange={(e: any) => {
									const files = e.target.files;
									if (files && files.length > 0) {
										onChange(files);
									}
								}}
								{...field}
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
