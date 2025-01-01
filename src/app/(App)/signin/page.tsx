import { Metadata } from 'next';
import MiniNavbar from '../_components/HeaderMini';
import Footer from '../_components/Footer';
import SigninComponent from './_signinComponent';

export const metadata: Metadata = {
	title: 'Signin to IvydaleFashion',
	description: 'Sign in or Login here to access your Ivydalefashion account.',
};

const SigninPage = () => {
	return (
		<div>
			<MiniNavbar></MiniNavbar>
			<SigninComponent></SigninComponent>
			{/* <Footer></Footer> */}
		</div>
	);
};

export default SigninPage;
