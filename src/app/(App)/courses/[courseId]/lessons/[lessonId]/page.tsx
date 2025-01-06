import { Metadata } from 'next';
import { Container } from 'react-bootstrap';
import LessonPlayer from './lessonPlayerComponent'

export const metadata: Metadata = {
	title: 'Lesson',
	description: 'Lesson page',
};


const LessonPlayerPage = () => {
	return (
		<div>
			<LessonPlayer></LessonPlayer>
		</div>
	);
};

export default LessonPlayerPage;
