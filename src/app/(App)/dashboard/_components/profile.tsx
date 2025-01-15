// components/Profile.tsx
'use client';
import { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Camera } from 'lucide-react';

interface Instructor {
	id: number;
	firstName: string;
	lastName: string;
	profilePicture: string;
	bio: string;
	specialization: string;
}

interface ProfileProps {
	instructor: Instructor;
	onUpdate: (updatedData: Partial<Instructor>) => void;
}

const Profile = ({ instructor, onUpdate }: ProfileProps) => {
	const [editing, setEditing] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		firstName: instructor.firstName,
		lastName: instructor.lastName,
		bio: instructor.bio,
		specialization: instructor.specialization,
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setError(null);

		try {
			const response = await fetch(`/api/instructor/${instructor.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) throw new Error('Failed to update profile');

			const updatedData = await response.json();
			onUpdate(updatedData);
			setEditing(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-4">
			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold">Profile</h1>
					{!editing && (
						<Button variant="outline-primary" onClick={() => setEditing(true)}>
							Edit Profile
						</Button>
					)}
				</div>

				{error && (
					<Alert variant="danger" className="mb-4">
						{error}
					</Alert>
				)}

				<div className="mb-6 text-center">
					<div className="relative inline-block">
						<img
							src={instructor.profilePicture || '/placeholder-avatar.png'}
							alt="Profile picture"
							className="w-32 h-32 rounded-full object-cover"
						/>
						{editing && (
							<Button
								className="absolute bottom-0 right-0 rounded-full p-2 bg-blue-600 hover:bg-blue-700"
								onClick={() => {
									/* Implement profile picture upload */
								}}
							>
								<Camera size={20} className="text-white" />
							</Button>
						)}
					</div>
				</div>

				<Form onSubmit={handleSubmit}>
					<Row className="mb-4">
						<Col md={6}>
							<Form.Group>
								<Form.Label>First Name</Form.Label>
								<Form.Control
									type="text"
									name="firstName"
									value={formData.firstName}
									onChange={handleInputChange}
									disabled={!editing}
									required
								/>
							</Form.Group>
						</Col>
						<Col md={6}>
							<Form.Group>
								<Form.Label>Last Name</Form.Label>
								<Form.Control
									type="text"
									name="lastName"
									value={formData.lastName}
									onChange={handleInputChange}
									disabled={!editing}
									required
								/>
							</Form.Group>
						</Col>
					</Row>

					<Form.Group className="mb-4">
						<Form.Label>Specialization</Form.Label>
						<Form.Control
							type="text"
							name="specialization"
							value={formData.specialization}
							onChange={handleInputChange}
							disabled={!editing}
						/>
					</Form.Group>

					<Form.Group className="mb-4">
						<Form.Label>Bio</Form.Label>
						<Form.Control
							as="textarea"
							name="bio"
							value={formData.bio}
							onChange={handleInputChange}
							disabled={!editing}
							rows={4}
						/>
					</Form.Group>

					{editing && (
						<div className="flex gap-2 justify-end">
							<Button
								variant="outline-secondary"
								onClick={() => {
									setEditing(false);
									setFormData({
										firstName: instructor.firstName,
										lastName: instructor.lastName,
										bio: instructor.bio,
										specialization: instructor.specialization,
									});
								}}
								disabled={saving}
							>
								Cancel
							</Button>
							<Button variant="primary" type="submit" disabled={saving}>
								{saving ? 'Saving...' : 'Save Changes'}
							</Button>
						</div>
					)}
				</Form>
			</div>
		</div>
	);
};

export default Profile;
