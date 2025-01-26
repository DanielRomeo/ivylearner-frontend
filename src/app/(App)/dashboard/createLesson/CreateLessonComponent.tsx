'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Form, Button, ProgressBar, Container } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/app/(App)/_styles/dashboard/createCourseComponent.module.scss'; // still using the createCourseComponent

const lessonSchema = yup.object().shape({
  title: yup.string().required('Lesson title is required'),
  description: yup.string().required('Description is required'),
  videoFile: yup.mixed().required('Video file is required'),
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      if (!courseId) {
        router.push('/dashboard');
        return;
      }

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('videoFile', data.videoFile[0]);

      setUploading(true);
      setError(null);

      const response = await axios.post(`/api/lessons/upload/${courseId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

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
    <Container className={styles.container}>
      <h2 className="my-4">Create Lesson</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Lesson Title</Form.Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                isInvalid={!!errors.title}
                placeholder="Enter lesson title"
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.title?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                as="textarea"
                isInvalid={!!errors.description}
                placeholder="Enter lesson description"
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.description?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Video File</Form.Label>
          <Controller
            name="videoFile"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="file"
                isInvalid={!!errors.videoFile}
                onChange={(e) => field.onChange(e.target.files)}
                accept="video/*"
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.videoFile?.message}
          </Form.Control.Feedback>
        </Form.Group>

        {uploading && (
          <ProgressBar
            now={uploadProgress}
            label={`${uploadProgress}%`}
            className="mb-3"
          />
        )}

        {error && <p className="text-danger">{error}</p>}

        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            onClick={() => router.push(`/dashboard/courseDetails?courseId=${courseId}`)}
            className="me-2"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Create Lesson'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateLessonComponent;
