'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Form, Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import styles from '../_styles/signinComponent.module.scss';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

// Schema:
const schema = yup.object().shape({
	email: yup.string().email('Invalid email').required('Email is required.'),
	password: yup.string().required('Password is required.'),
});

const SigninComponent = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(schema) });

	const onSubmit = async (data: any) => {
		try {
			setIsLoading(true);
			console.log(data);
			// Make Axios request to login
			const response = await axios.post('http://localhost:5000/login', {
				email: data.email,
				password: data.password,
			});

			// Assuming the response contains an access token
			const { access_token } = response.data;

			// Store the token in localStorage or a global state
			localStorage.setItem('access_token', access_token);

			// Optionally, redirect to a protected page
			router.push('/protected');
		} catch (error) {
			console.error('Login failed:', error);
			alert('Login failed. Please check your credentials.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.main}>
			<Container className={` ${styles.mainContainer} `}>
				<div className={styles.box}>
					<Row className={`${styles.primaryRow}`}>
						<h2 className={` ${styles.primaryLabel}`}>Log in.</h2>
						<label className={`${styles.secondaryLabel}`}>
							Please enter your email and password
						</label>
					</Row>

					<Row>
						<form onSubmit={handleSubmit(onSubmit)} className={` ${styles.mainForm}`}>
							{/* Email input field */}
							<Form.Group>
								{errors.email && (
									<span className={styles.errorMessage}>
										{errors.email.message}
									</span>
								)}

								<input
									className={`form-control shadow-none ${styles.input} ${styles.emailInput}`}
									type="email"
									{...register('email')}
									id=""
									placeholder="email address"
								/>
							</Form.Group>

							{/* Password input field (Input group)*/}
							{errors.password && (
								<span className={styles.errorMessage}>
									{errors.password.message}
								</span>
							)}

							<InputGroup className={`${styles.inputGroup}`}>
								<Form.Control
									className={`form-control shadow-none ${styles.input} ${styles.passwordInput}`}
									{...register('password')}
									type="password"
									placeholder="Enter password"
									aria-label="Password"
									aria-describedby="basic-addon2"
								/>
								<Link href="/forgotpassword">
									<Button
										variant="outline-secondary"
										className={`input-group-text ${styles.forgotPasswordButton}`}
										id="button-addon2"
									>
										forgot password?
									</Button>
								</Link>
							</InputGroup>

							{/* Login button */}
							<Button type="submit" className={`${styles.loginButton}`}>
								LOGIN
							</Button>

							<br />

							<Link href="signup">
								<p className={styles.createAccountLink}>
									New customer? <span>Create an account</span>
								</p>
							</Link>
						</form>
					</Row>
				</div>
			</Container>
		</div>
	);
};

export default SigninComponent;
