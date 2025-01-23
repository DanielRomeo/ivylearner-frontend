import { Metadata } from 'next';
import CreateOrganisationComponent from './createOrganisationComponent';
import MainNavbar from '../../_components/MainNavbar';

export const metadata: Metadata = {
	title: 'Create Organisation page',
	description: 'Create an organisation page',
};

const SigninPage = () => {
	return (
		<div>
			<MainNavbar></MainNavbar>
             <CreateOrganisationComponent></CreateOrganisationComponent>

		</div>
	);
};

export default SigninPage;
