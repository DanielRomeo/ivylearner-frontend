import React from 'react';
import { Metadata } from 'next';
import MainNavbar from '../_components/Header';
import Footer from '../_components/Footer';
import ForgotPasswordComponent from './_forgotPassword';

export const metadata: Metadata = {
	title: '',
	description: '',
};

const ForgotPasswordPage = () => {
	return (
		<div>
			<MainNavbar></MainNavbar>
			<ForgotPasswordComponent></ForgotPasswordComponent>
			<Footer></Footer>
		</div>
	);
};

export default ForgotPasswordPage;
