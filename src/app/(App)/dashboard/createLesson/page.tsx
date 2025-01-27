import { Metadata } from 'next';
import CreateLessonComponent from './CreateLessonComponent';
// import MainNavbar from '../../_components/MainNavbar';

export const metadata: Metadata = {
	title: 'Create Lesson Page',
	description: 'Create Lesson page',
};

const CreateLesson = () => {
	return (
		<div>
			<CreateLessonComponent></CreateLessonComponent>
		</div>
	);
};

export default CreateLesson;
