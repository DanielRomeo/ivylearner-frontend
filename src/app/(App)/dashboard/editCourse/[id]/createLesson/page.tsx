import { Metadata } from 'next';
import AddLessonComponent from './AddLessonComponent';
// import MainNavbar from '../../_components/MainNavbar';

export const metadata: Metadata = {
	title: 'add lesson',
	description: 'add lesson',
};

const SigninPage = () => {
	return (
		<div>
			{/* <MainNavbar></MainNavbar> */}
			<AddLessonComponent></AddLessonComponent>
		</div>
	);
};

export default SigninPage;
