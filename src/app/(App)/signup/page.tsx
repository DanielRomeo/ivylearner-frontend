import { Metadata } from 'next';
import MiniNavbar from '../_components/HeaderMini';
import Footer from '../_components/Footer';
import SignupComponent from './_signupComponent';

export const metadata: Metadata = {
	title: 'SignUp to IvydaleFashion',
	description: 'SignUp to access your Ivydalefashion account.',
};

const SignupPage = () => {
	return (
		<div>
			<MiniNavbar></MiniNavbar>
			<SignupComponent></SignupComponent>
		</div>
	);
};

export default SignupPage;
