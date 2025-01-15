import { Metadata } from 'next';
// import DashboardComponent from './protectedComponent';
import DashboardComponent from './dashboardComponent'

export const metadata: Metadata = {
	title: 'Signin to IvydaleFashion',
	description: 'Sign in or Login here to access your Ivydalefashion account.',
};

const SigninPage = () => {
	return (
		<div>
			<DashboardComponent></DashboardComponent>
			{/* <Footer></Footer> */}
		</div>
	);
};

export default SigninPage;
