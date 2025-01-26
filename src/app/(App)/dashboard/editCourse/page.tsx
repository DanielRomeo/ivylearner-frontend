import { Metadata } from 'next';
import EditCourseComponent from './editCourseComponent';
import MainNavbar from '../../_components/MainNavbar';

export const metadata: Metadata = {
	title: 'Edit course page',
	description: 'Edit course page',
};

const SigninPage = () => {
	return (
		<div>
			<MainNavbar></MainNavbar>
			<EditCourseComponent></EditCourseComponent>
		</div>
	);
};

export default SigninPage;
