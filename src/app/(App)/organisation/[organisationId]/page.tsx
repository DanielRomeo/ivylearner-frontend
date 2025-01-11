import { Metadata } from 'next';
import { Container } from 'react-bootstrap';
import OrganisationIdComponent from './organisationIdComponent';

export const metadata: Metadata = {
	title: 'Lesson',
	description: 'Lesson page',
};

const OrganisationPage = () => {
	return (
		<div>
			<OrganisationIdComponent></OrganisationIdComponent>
		</div>
	);
};
export default OrganisationPage;
