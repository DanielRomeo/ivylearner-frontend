import { Metadata } from 'next';
import ModernNavbar from '../_components/MainNavbar';
import AboutComponent from './aboutComponent';
import MainFooter from '../_components/MainFooter';

export const metadata: Metadata = {
	title: 'About Us — IvyLearner',
	description: 'Learn about IvyLearner\'s mission, team, and values.',
};

const AboutPage = () => {
	return (
		<div>
			<ModernNavbar />
			<AboutComponent />
			<MainFooter />
		</div>
	);
};

export default AboutPage;
