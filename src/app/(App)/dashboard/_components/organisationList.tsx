// components/OrganizationsList.tsx
'use client';
import { useState, useEffect } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Plus } from 'lucide-react';

interface Organization {
	id: number;
	name: string;
	logo: string;
}

const OrganizationsList = () => {
	const [organizations, setOrganizations] = useState<Organization[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchOrganizations();
	}, []);

	const fetchOrganizations = async () => {
		try {
			const response = await fetch('/api/organizations', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});

			if (!response.ok) throw new Error('Failed to fetch organizations');

			const data = await response.json();
			setOrganizations(data);
		} catch (error) {
			console.error('Error fetching organizations:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div className="text-center p-4">Loading organizations...</div>;
	}

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Organizations</h1>
				<Button
					className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
					onClick={() => {
						/* Implement new organization creation */
					}}
				>
					<Plus size={20} />
					New Organization
				</Button>
			</div>

			<Row className="g-4">
				{organizations.map((org) => (
					<Col key={org.id} xs={12} md={6} lg={4}>
						<Card className="h-100 shadow-sm hover:shadow-md transition-shadow duration-200">
							<div className="p-4">
								<div className="flex items-center gap-4">
									<img
										src={org.logo || '/placeholder-logo.png'}
										alt={`${org.name} logo`}
										className="w-16 h-16 object-contain rounded"
									/>
									<div>
										<h3 className="text-lg font-semibold">{org.name}</h3>
										<Button
											variant="link"
											className="p-0 text-blue-600 hover:text-blue-800"
											onClick={() => {
												/* Implement organization management */
											}}
										>
											Manage Organization
										</Button>
									</div>
								</div>
							</div>
						</Card>
					</Col>
				))}

				{organizations.length === 0 && (
					<Col xs={12}>
						<div className="text-center p-8 bg-gray-50 rounded-lg">
							<p className="text-gray-600 mb-4">No organizations found</p>
							<Button
								variant="primary"
								className="flex items-center gap-2 mx-auto"
								onClick={() => {
									/* Implement new organization creation */
								}}
							>
								<Plus size={20} />
								Create Your First Organization
							</Button>
						</div>
					</Col>
				)}
			</Row>
		</div>
	);
};

export default OrganizationsList;
