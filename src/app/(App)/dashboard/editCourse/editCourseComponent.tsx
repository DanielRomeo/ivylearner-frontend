'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/auth-context';
import axios from 'axios';

// Import styles
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
});

// Main component
const EditCourseComponent = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const { user, isAuthenticated, getToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
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
        router.push('/dashboard');
        return;
      }

      const response = await axios.get(`/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const courseData = response.data;
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
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {
    if (isAuthenticated && courseId) {
      fetchCourseData();
    } else if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, courseId, fetchCourseData, router]);

  if (loading) return <div>Loading...</div>;

  return (
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

        {/* Add other form fields like shortDescription, tags, etc., similar to CreateCourseComponent */}
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
    </Container>
  );
};

export default EditCourseComponent;
