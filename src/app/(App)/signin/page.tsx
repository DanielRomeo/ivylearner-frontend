import { Metadata } from 'next';
import SigninComponent from './_signinComponent';

export const metadata: Metadata = {
	title: 'Signin to ivylearner',
	description: 'Sign in or Login here to access your ivylearner account.',
};

const SigninPage = () => {
	return (
		<div>
			<SigninComponent></SigninComponent>
			{/* <Footer></Footer> */}
		</div>
	);
};

export default SigninPage;
