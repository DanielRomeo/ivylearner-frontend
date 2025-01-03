import { Metadata } from 'next';
import SignupComponent from './_signupComponent';

export const metadata: Metadata = {
	title: 'SignUp to IvydaleFashion',
	description: 'SignUp to access your Ivydalefashion account.',
};

const SignupPage = () => {
	return (
		<div>
			<SignupComponent></SignupComponent>
		</div>
	);
};

export default SignupPage;
