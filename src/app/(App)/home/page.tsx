import React from 'react';
import { Metadata } from 'next';
import HomeComponent from './homeComponent';
import MainFooter from '../_components/MainFooter';


export const metadata: Metadata = {
	title: 'Ivy Learner Home',
	description: 'IvyLearner Home',
};

const HomePage = () => {
	return (
		<div>
			<HomeComponent></HomeComponent>
			<MainFooter></MainFooter>
		</div>
	);
};

export default HomePage;
