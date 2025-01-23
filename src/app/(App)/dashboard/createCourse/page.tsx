import { Metadata } from 'next';
import CreateCourseComponent from './createCourseComponent';
import MainNavbar from '../../_components/MainNavbar';

export const metadata: Metadata = {
	title: 'Create course page',
	description: 'Create a course page',
};

const CreateCoursePage = () => {
	return (
		<div>
			<MainNavbar></MainNavbar>
			<CreateCourseComponent></CreateCourseComponent>
		</div>
	);
};

export default CreateCoursePage;
