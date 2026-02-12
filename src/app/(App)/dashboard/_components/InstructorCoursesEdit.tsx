'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Row, Col, Card, Form, Button, Accordion, Alert, Spinner, ListGroup, InputGroup } from 'react-bootstrap';
import { FaSave, FaUpload, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';
// import styles from '../_styles/EditCourse.module.scss';
// import styles from '../_styles/InstructorCoursesEdit.module.scss';
import styles from '../_styles/InstructorCoursesEdit.module.scss'; // Assuming you have this CSS module for styling

const EditCourse = () => {
    const { id } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [instructors, setInstructors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newLesson, setNewLesson] = useState({ 
        title: '', 
        content_url: '', 
        order: 1, 
        duration_minutes: 0, 
        is_free_preview: false 
    });
    const [uploading, setUploading] = useState(false);
    const [searchMember, setSearchMember] = useState('');

    // Cloudinary config - replace with your actual values
    const CLOUDINARY_CLOUD_NAME = 'your_cloud_name';
    const CLOUDINARY_UPLOAD_PRESET = 'your_unsigned_preset';

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            // Fetch course details
            setLoading(true);
			const token = localStorage.getItem('access_token');

			

            const courseRes = await fetch(`/api/courses/${id}`, {
                headers: { 
                    'Authorization': `Bearer ${token || ''}`,
                    
                },
            });
            
            if (!courseRes.ok) throw new Error('Failed to fetch course');
            const courseData = await courseRes.json();
            setCourse(courseData.data);
            setNewLesson({ ...newLesson, order: courseData.data.lessons?.length + 1 || 1 });

            // // Fetch lessons for this course
            // const lessonsRes = await fetch(`/api/lessons/course/${id}`, {
            //     headers: { 
            //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
            //         'Content-Type': 'application/json'
            //     },
            // });
            
            // if (lessonsRes.ok) {
            //     const lessonsData = await lessonsRes.json();
            //     setLessons(lessonsData.data || []);
            // }

            // // Fetch organization members if course belongs to an organization
            // if (courseData.data.organizationId) {
            //     const membersRes = await fetch(`/api/organizations/${courseData.data.organizationId}/members`, {
            //         headers: { 
            //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
            //             'Content-Type': 'application/json'
            //         },
            //     });
                
            //     if (membersRes.ok) {
            //         const membersData = await membersRes.json();
            //         setMembers(membersData.data || []);
            //     }
            // }

            // // Fetch course instructors
            // const instructorsRes = await fetch(`/api/courses/${id}/instructors`, {
            //     headers: { 
            //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
            //         'Content-Type': 'application/json'
            //     },
            // });
            
            // if (instructorsRes.ok) {
            //     const instructorsData = await instructorsRes.json();
            //     setInstructors(instructorsData.data || []);
            // }
        } catch (err: any) {
            setError('Failed to load course data: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handlePublishToggle = async (checked: boolean) => {
        if (checked && lessons.length < 5) {
            alert('Cannot publish course with fewer than 5 lessons.');
            return;
        }
        setCourse({ ...course, status: checked ? 'published' : 'draft' });
    };

    const uploadToCloudinary = async (file: File, type: 'image' | 'video') => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('resource_type', type);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type}/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.secure_url) {
                return data.secure_url;
            } else {
                throw new Error('Upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
            alert('Failed to upload file');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const url = await uploadToCloudinary(e.target.files[0], 'image');
            if (url) {
                setCourse({ ...course, thumbnail_url: url });
            }
        }
    };

    const handleLessonChange = (index: number, field: string, value: any) => {
        const updatedLessons = [...lessons];
        updatedLessons[index] = { ...updatedLessons[index], [field]: value };
        setLessons(updatedLessons);
    };

    const handleNewLessonChange = (field: string, value: any) => {
        setNewLesson({ ...newLesson, [field]: value });
    };

    const handleNewLessonVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const url = await uploadToCloudinary(e.target.files[0], 'video');
            if (url) {
                setNewLesson({ ...newLesson, content_url: url });
            }
        }
    };

    const addNewLesson = async () => {
        try {
            const res = await fetch('/api/lessons', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    ...newLesson, 
                    course_id: parseInt(id as string) 
                })
            });
            
            if (!res.ok) {
                if (res.status === 403) {
                    alert('You do not have permission to create lessons. Only organization owners/admins can create lessons.');
                } else {
                    alert('Failed to add lesson');
                }
                return;
            }
            
            const data = await res.json();
            setLessons([...lessons, data.data]);
            setNewLesson({ 
                title: '', 
                content_url: '', 
                order: lessons.length + 2, 
                duration_minutes: 0, 
                is_free_preview: false 
            });
        } catch (err: any) {
            console.error('Error adding lesson:', err);
            alert('Failed to add lesson');
        }
    };

    const deleteLesson = async (lessonId: number) => {
        if (confirm('Are you sure you want to delete this lesson?')) {
            try {
                const res = await fetch(`/api/lessons/${lessonId}`, {
                    method: 'DELETE',
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                });
                
                if (!res.ok) {
                    if (res.status === 403) {
                        alert('You do not have permission to delete lessons. Only organization owners/admins can delete lessons.');
                    } else {
                        alert('Failed to delete lesson');
                    }
                    return;
                }
                
                setLessons(lessons.filter((l) => l.id !== lessonId));
            } catch (err: any) {
                console.error('Error deleting lesson:', err);
                alert('Failed to delete lesson');
            }
        }
    };

    const addInstructor = async (userId: number) => {
        try {
            const res = await fetch(`/api/courses/${id}/instructors`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, role: 'assistant' })
            });
            
            if (!res.ok) {
                if (res.status === 403) {
                    alert('You do not have permission to add instructors. Only organization owners/admins can manage instructors.');
                } else {
                    alert('Failed to add instructor');
                }
                return;
            }
            
            fetchCourseData(); // Refresh instructors and members
        } catch (err: any) {
            console.error('Error adding instructor:', err);
            alert('Failed to add instructor');
        }
    };

    const removeInstructor = async (userId: number) => {
        if (confirm('Are you sure you want to remove this instructor?')) {
            try {
                const res = await fetch(`/api/courses/${id}/instructors/${userId}`, {
                    method: 'DELETE',
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                });
                
                if (!res.ok) {
                    if (res.status === 403) {
                        alert('You do not have permission to remove instructors. Only organization owners/admins can manage instructors.');
                    } else {
                        alert('Failed to remove instructor');
                    }
                    return;
                }
                
                fetchCourseData();
            } catch (err: any) {
                console.error('Error removing instructor:', err);
                alert('Failed to remove instructor');
            }
        }
    };

    const updateInstructorRole = async (userId: number, role: 'lead' | 'assistant') => {
        try {
            const res = await fetch(`/api/courses/${id}/instructors/${userId}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role })
            });
            
            if (!res.ok) {
                if (res.status === 403) {
                    alert('You do not have permission to update instructor roles. Only organization owners/admins can manage instructors.');
                } else {
                    alert('Failed to update role');
                }
                return;
            }
            
            fetchCourseData();
        } catch (err: any) {
            console.error('Error updating role:', err);
            alert('Failed to update role');
        }
    };

    const saveChanges = async () => {
        try {
            // Update course
            const courseRes = await fetch(`/api/courses/${id}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(course)
            });
            
            if (!courseRes.ok) {
                if (courseRes.status === 403) {
                    setError('You do not have permission to update this course. Only organization owners/admins can update courses.');
                } else {
                    setError('Failed to save course changes');
                }
                return;
            }
            
            // Update all lessons
            for (const lesson of lessons) {
                const lessonRes = await fetch(`/api/lessons/${lesson.id}`, {
                    method: 'PUT',
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(lesson)
                });
                
                if (!lessonRes.ok) {
                    console.error(`Failed to update lesson ${lesson.id}`);
                }
            }
            
            alert('Course updated successfully');
            router.push('/dashboard/instructor/courses');
        } catch (err: any) {
            console.error('Error saving changes:', err);
            setError('Failed to save changes');
        }
    };

    const filteredMembers = members.filter(m => 
        !instructors.some(i => i.userId === m.userId) && 
        `${m.firstName || ''} ${m.lastName || ''} ${m.email || ''}`.toLowerCase().includes(searchMember.toLowerCase())
    );

    if (loading) return (
        <div className={styles.loadingContainer}>
            <Spinner animation="border" variant="primary" />
        </div>
    );
    
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className={styles.editCoursePage}>
            <div className={styles.header}>
                <h1>Edit Course: {course?.title}</h1>
                <Button onClick={saveChanges} disabled={uploading} className={styles.saveBtn}>
                    <FaSave /> Save All Changes
                </Button>
            </div>

            <Row className="g-4">
                <Col lg={8}>
                    <Card className={styles.formCard}>
                        <Card.Body>
                            <h2 className={styles.sectionTitle}>Course Details</h2>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control 
                                        name="title" 
                                        value={course?.title || ''} 
                                        onChange={handleCourseChange} 
                                        className={styles.input}
                                    />
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={4}
                                        name="description" 
                                        value={course?.description || ''} 
                                        onChange={handleCourseChange}
                                        className={styles.textarea}
                                    />
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Thumbnail</Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleThumbnailUpload}
                                        className={styles.fileInput}
                                    />
                                    {course?.thumbnail_url && (
                                        <div className={styles.thumbnailPreview}>
                                            <img src={course.thumbnail_url} alt="Thumbnail" />
                                        </div>
                                    )}
                                </Form.Group>
                                
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                name="price" 
                                                value={course?.price || ''} 
                                                onChange={handleCourseChange}
                                                className={styles.input}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Control 
                                                name="category" 
                                                value={course?.category || ''} 
                                                onChange={handleCourseChange}
                                                className={styles.input}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                <Form.Group className="mb-3">
                                    <Form.Check 
                                        type="switch"
                                        label="Publish Course"
                                        checked={course?.status === 'published'}
                                        onChange={(e) => handlePublishToggle(e.target.checked)}
                                        className={styles.switch}
                                    />
                                    <Form.Text className="text-muted">
                                        Courses must have at least 5 lessons to be published
                                    </Form.Text>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card className={styles.formCard}>
                        <Card.Body>
                            <h2 className={styles.sectionTitle}>Lessons ({lessons.length})</h2>
                            
                            <Accordion className={styles.lessonsAccordion}>
                                {lessons.map((lesson, index) => (
                                    <Accordion.Item eventKey={index.toString()} key={lesson.id}>
                                        <Accordion.Header>
                                            <span className={styles.lessonNumber}>Lesson {index + 1}</span>
                                            <span className={styles.lessonTitle}>{lesson.title}</span>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Title</Form.Label>
                                                <Form.Control 
                                                    value={lesson.title} 
                                                    onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                                                    className={styles.input}
                                                />
                                            </Form.Group>
                                            
                                            <Form.Group className="mb-3">
                                                <Form.Label>Video URL</Form.Label>
                                                <Form.Control 
                                                    value={lesson.content_url} 
                                                    onChange={(e) => handleLessonChange(index, 'content_url', e.target.value)}
                                                    className={styles.input}
                                                />
                                            </Form.Group>
                                            
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Order</Form.Label>
                                                        <Form.Control 
                                                            type="number" 
                                                            value={lesson.order} 
                                                            onChange={(e) => handleLessonChange(index, 'order', parseInt(e.target.value))}
                                                            className={styles.input}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Duration (minutes)</Form.Label>
                                                        <Form.Control 
                                                            type="number" 
                                                            value={lesson.duration_minutes} 
                                                            onChange={(e) => handleLessonChange(index, 'duration_minutes', parseInt(e.target.value))}
                                                            className={styles.input}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            
                                            <Form.Check 
                                                type="switch"
                                                label="Free Preview"
                                                checked={lesson.is_free_preview}
                                                onChange={(e) => handleLessonChange(index, 'is_free_preview', e.target.checked)}
                                                className={`${styles.switch} mb-3`}
                                            />
                                            
                                            <Button 
                                                variant="danger" 
                                                onClick={() => deleteLesson(lesson.id)}
                                                className={styles.deleteBtn}
                                            >
                                                <FaTrash /> Delete Lesson
                                            </Button>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                                
                                <Accordion.Item eventKey="new" className={styles.newLessonItem}>
                                    <Accordion.Header>
                                        <span className={styles.addNew}><FaPlus /> Add New Lesson</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control 
                                                value={newLesson.title} 
                                                onChange={(e) => handleNewLessonChange('title', e.target.value)}
                                                className={styles.input}
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-3">
                                            <Form.Label>Upload Video</Form.Label>
                                            <Form.Control 
                                                type="file" 
                                                accept="video/*" 
                                                onChange={handleNewLessonVideoUpload}
                                                className={styles.fileInput}
                                            />
                                            {newLesson.content_url && (
                                                <Alert variant="success" className="mt-2">
                                                    Video uploaded successfully!
                                                </Alert>
                                            )}
                                        </Form.Group>
                                        
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Order</Form.Label>
                                                    <Form.Control 
                                                        type="number" 
                                                        value={newLesson.order} 
                                                        onChange={(e) => handleNewLessonChange('order', parseInt(e.target.value))}
                                                        className={styles.input}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Duration (minutes)</Form.Label>
                                                    <Form.Control 
                                                        type="number" 
                                                        value={newLesson.duration_minutes} 
                                                        onChange={(e) => handleNewLessonChange('duration_minutes', parseInt(e.target.value))}
                                                        className={styles.input}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        
                                        <Form.Check 
                                            type="switch"
                                            label="Free Preview"
                                            checked={newLesson.is_free_preview}
                                            onChange={(e) => handleNewLessonChange('is_free_preview', e.target.checked)}
                                            className={`${styles.switch} mb-3`}
                                        />
                                        
                                        <Button 
                                            onClick={addNewLesson} 
                                            disabled={uploading || !newLesson.title || !newLesson.content_url}
                                            className={styles.addBtn}
                                        >
                                            <FaPlus /> Add Lesson
                                        </Button>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className={styles.formCard}>
                        <Card.Body>
                            <h2 className={styles.sectionTitle}>Instructors ({instructors.length})</h2>
                            
                            <ListGroup className={styles.instructorsList}>
                                {instructors.map((inst: any) => (
                                    <ListGroup.Item key={inst.userId} className={styles.instructorItem}>
                                        <div className={styles.instructorInfo}>
                                            <div className={styles.instructorName}>
                                                {inst.firstName} {inst.lastName}
                                            </div>
                                            <div className={styles.instructorEmail}>
                                                {inst.email}
                                            </div>
                                        </div>
                                        <div className={styles.instructorActions}>
                                            <Form.Select 
                                                value={inst.role} 
                                                onChange={(e) => updateInstructorRole(inst.userId, e.target.value as 'lead' | 'assistant')}
                                                className={styles.roleSelect}
                                            >
                                                <option value="lead">Lead</option>
                                                <option value="assistant">Assistant</option>
                                            </Form.Select>
                                            <Button 
                                                variant="danger" 
                                                size="sm" 
                                                onClick={() => removeInstructor(inst.userId)}
                                                className={styles.removeBtn}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                                {instructors.length === 0 && (
                                    <ListGroup.Item className={styles.emptyState}>
                                        No instructors assigned yet
                                    </ListGroup.Item>
                                )}
                            </ListGroup>

                            <div className={styles.addInstructorSection}>
                                <h3 className={styles.subTitle}>Add Instructor</h3>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FaSearch />
                                    </InputGroup.Text>
                                    <Form.Control 
                                        placeholder="Search members..." 
                                        value={searchMember}
                                        onChange={(e) => setSearchMember(e.target.value)}
                                        className={styles.searchInput}
                                    />
                                </InputGroup>
                                
                                <ListGroup className={styles.membersList}>
                                    {filteredMembers.slice(0, 5).map((member: any) => (
                                        <ListGroup.Item 
                                            key={member.userId} 
                                            className={styles.memberItem}
                                        >
                                            <div className={styles.memberInfo}>
                                                <div className={styles.memberName}>
                                                    {member.firstName} {member.lastName}
                                                </div>
                                                <div className={styles.memberEmail}>
                                                    {member.email}
                                                </div>
                                            </div>
                                            <Button 
                                                size="sm" 
                                                onClick={() => addInstructor(member.userId)}
                                                className={styles.addMemberBtn}
                                            >
                                                <FaPlus />
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                    {filteredMembers.length === 0 && (
                                        <ListGroup.Item className={styles.emptyState}>
                                            No available members found
                                        </ListGroup.Item>
                                    )}
                                    {filteredMembers.length > 5 && (
                                        <ListGroup.Item className={styles.moreResults}>
                                            +{filteredMembers.length - 5} more results
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {uploading && (
                <div className={styles.uploadingOverlay}>
                    <Spinner animation="border" variant="light" />
                    <p>Uploading...</p>
                </div>
            )}
        </div>
    );
};

export default EditCourse;