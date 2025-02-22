import { Metadata } from 'next';
import SignupComponent from './signupComponent';

export const metadata: Metadata = {
	title: 'SignUp to Ivylearner',
	description: 'SignUp to access your Ivylearner.',
};

const SignupPage = () => {
	return (
		<div>
			<SignupComponent></SignupComponent>
		</div>
	);
};

export default SignupPage;
