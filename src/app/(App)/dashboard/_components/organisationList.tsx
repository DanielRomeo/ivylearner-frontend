// components/OrganizationsList.tsx

'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaPlus, FaPencilAlt } from 'react-icons/fa';
import styles from '../../_styles/dashboard/organisationComponent.module.scss'

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
			// const response = await axios.get(`/api/organisations/first/${instructorId}`, {
			// 	headers: {
			// 		Authorization: `Bearer ${localStorage.getItem('token')}`,
			// 	},
			// });
			const response = await axios.get(`/api/organisations/first/${instructorId}`);
			setOrganization(response.data);
		} catch (error) {
			console.error('Error fetching organization:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div className={styles.loading}>Loading organization...</div>;
	  }
	
	  if (organization) {
		return (
		  <div className={styles.container}>
			<div className={styles.card}>
			  <div className={styles.header}>
				<img
				  src={organization.logo || '/placeholder-logo.png'}
				  alt={`${organization.name} logo`}
				  className={styles.logo}
				/>
				<div>
				  <h2 className={styles.name}>{organization.name}</h2>
				  {organization.description && (
					<p className={styles.description}>{organization.description}</p>
				  )}
				  <p className={styles.date}>
					Created At: {new Date(organization.createdAt).toLocaleDateString()}
				  </p>
				</div>
			  </div>
			  <div className={styles.actions}>
				<button
				  className={styles.manageBtn}
				  onClick={() => router.push(`/dashboard/manageOrganisation/${organization.id}`)}
				>
				  <FaPencilAlt className={styles.icon} /> Manage Organization
				</button>
			  </div>
			</div>
		  </div>
		);
	  }
	
	  return (
		<div className={styles.container}>
		  <div className={styles.empty}>
			<h3>No organization found</h3>
			<button
			  className={styles.createBtn}
			  onClick={() => router.push('/dashboard/createOrganisation')}
			>
			  <FaPlus className={styles.icon} /> Create Your First Organization
			</button>
		  </div>
		</div>
	  );
	}
export default OrganizationsList;
