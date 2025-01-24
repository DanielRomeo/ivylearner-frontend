// components/OrganizationsList.tsx

'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaPlus, FaPencilAlt } from 'react-icons/fa';
import './OrganizationsList.scss';

interface Organization {
	id: number;
	name: string;
	description?: string;
	logo: string;
	createdAt: string;
}

interface OrganisationProps {
	instructorId: number;
}

const OrganizationsList = ({ instructorId }: OrganisationProps) => {
	const [organization, setOrganization] = useState<Organization | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		fetchOrganization();
	}, []);

	const fetchOrganization = async () => {
		try {
			const response = await axios.get(`/api/organisations/getByInstructor/${instructorId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			setOrganization(response.data);
		} catch (error) {
			console.error('Error fetching organization:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div className="organization-loading">Loading organization...</div>;
	}

	if (organization) {
		return (
			<div className="organization-container">
				<div className="organization-card">
					<div className="organization-header">
						<img
							src={organization.logo || '/placeholder-logo.png'}
							alt={`${organization.name} logo`}
							className="organization-logo"
						/>
						<div>
							<h2 className="organization-name">{organization.name}</h2>
							{organization.description && (
								<p className="organization-description">
									{organization.description}
								</p>
							)}
							<p className="organization-date">
								Created At: {new Date(organization.createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>
					<div className="organization-actions">
						<button
							className="organization-manage-btn"
							onClick={() =>
								router.push(`/dashboard/manageOrganisation/${organization.id}`)
							}
						>
							<FaPencilAlt className="organization-icon" /> Manage Organization
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="organization-container">
			<div className="organization-empty">
				<h3>No organization found</h3>
				<button
					className="organization-create-btn"
					onClick={() => router.push('/dashboard/createOrganisation')}
				>
					<FaPlus className="organization-icon" /> Create Your First Organization
				</button>
			</div>
		</div>
	);
};

export default OrganizationsList;
