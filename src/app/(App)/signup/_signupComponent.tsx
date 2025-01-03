'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import styles from '../_styles/signupComponent.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import { Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

// Schema:
const schema = yup.object().shape({
	firstname: yup.string().required('First name  is required.'),
	lastname: yup.string().required('Last name  is required.'),
	email: yup.string().email('Invalid email').required('Email is required.'),
	password: yup
		.string()
		.required('Password is required.')
		.min(6, 'Password must be at least 6 characters.'),
	confirmPassword: yup
		.string()
		.required('Confirm Password is required.')
		.oneOf([yup.ref('password')], 'Passwords must match.'),
});

// User interface:
interface User {
	displayName: string | null;
	email: string | null;
	uid: string;
}

const SignupComponent = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(schema) });

	const onSubmit = (data: any) => {
		console.log(data);
		// Handle form submission here
	};

	return (
		<div>
			<Container className={`${styles.mainContainer} `}>
				<Row>
					<h2 className={` ${styles.primaryLabel}`}>Signup.</h2>
					<label className={`${styles.secondaryLabel}`}>
						Please fill in the fields below:
					</label>
				</Row>

				<Row>
					<form onSubmit={handleSubmit(onSubmit)} className={`${styles.mainForm}`}>
						<Form.Group>
							{errors.firstname && (
								<span className={styles.errorMessage}>
									{errors.firstname.message}
								</span>
							)}
							<input
								className={`form-control shadow-none ${styles.input} ${styles.firtnameInput}`}
								type="text"
								placeholder="First name"
								{...register('firstname')}
							/>
						</Form.Group>

						<Form.Group>
							{errors.lastname && (
								<span className={styles.errorMessage}>
									{errors.lastname.message}
								</span>
							)}
							<input
								className={`form-control shadow-none ${styles.input} ${styles.lastnameInput}`}
								type="text"
								{...register('lastname')}
								placeholder="Last name"
							/>
						</Form.Group>

						<Form.Group>
							{errors.email && (
								<span className={styles.errorMessage}>{errors.email.message}</span>
							)}
							<input
								className={`form-control shadow-none ${styles.input} ${styles.emailInput}`}
								type="email"
								{...register('email')}
								id=""
								placeholder="Email address"
							/>
						</Form.Group>

						<Form.Group>
							{errors.password && (
								<span className={styles.errorMessage}>
									{errors.password.message}
								</span>
							)}
							<input
								className={`form-control shadow-none ${styles.input} ${styles.passwordInput}`}
								type="password"
								{...register('password')}
								id=""
								placeholder="Password"
							/>
						</Form.Group>

						<Form.Group>
							{errors.confirmPassword && (
								<span className={styles.errorMessage}>
									{errors.confirmPassword.message}
								</span>
							)}
							<input
								className={`form-control shadow-none ${styles.input} ${styles.passwordConfirmInput}`}
								type="password"
								{...register('confirmPassword')}
								id=""
								placeholder="Confirm password"
							/>
						</Form.Group>

						<Button className={`${styles.loginButton}`}>SIGN UP</Button>

						<br />

						<Link href="signin">
							<p className={styles.createAccountLink}>
								Already have an account? <span>Sign In</span>
							</p>
						</Link>
					</form>
				</Row>
			</Container>
		</div>
	);
};

export default SignupComponent;
