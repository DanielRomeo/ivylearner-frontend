import { Metadata } from 'next';
import { Container } from 'react-bootstrap';
import CourseComponent from './courseComponent';

export const metadata: Metadata = {
	title: 'Course',
	description: 'Course page',
};


const CoursePage = () => {
	return (
		<div>
			<CourseComponent></CourseComponent>
           
		</div>
	);
};

export default CoursePage;
