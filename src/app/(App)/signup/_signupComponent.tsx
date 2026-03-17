'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Row, Form, Button } from 'react-bootstrap';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import axios from 'axios';

import styles from '../_styles/signupComponent.module.scss';
import ModernNavbar from '../_components/MainNavbar';

// Validation schema
const schema = yup.object().shape({
	firstname: yup.string().required('First name is required.'),
	lastname: yup.string().required('Last name is required.'),
	email: yup.string().email('Invalid email').required('Email is required.'),
	password: yup
		.string()
		.required('Password is required.')
		.min(6, 'Password must be at least 6 characters.'),
	confirmPassword: yup
		.string()
		.required('Confirm password is required.')
		.oneOf([yup.ref('password')], 'Passwords must match.'),
});

interface SignupFormData {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	confirmPassword: string;
}

const SignupComponent = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [role, setRole] = useState<'student' | 'instructor'>('student');

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupFormData>({ resolver: yupResolver(schema) });

	const onSubmit = async (data: SignupFormData) => {
		try {
			setIsLoading(true);
			setError('');

			const response = await axios.post('/api/auth/signup', {
				email: data.email,
				password: data.password,
				firstName: data.firstname,
				lastName: data.lastname,
				role: role,
			});

			if (response.status === 201) {
				// Redirect to signin after successful signup
				window.location.href = '/signin';
			}
		} catch (err) {
			if (axios.isAxiosError(err)) {
				if (err.response?.status === 409) {
					setError('An account with this email already exists.');
				} else if (err.response?.data?.message) {
					setError(err.response.data.message);
				} else {
					setError('Failed to create account. Please try again.');
				}
			} else {
				setError('An unexpected error occurred.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.main}>
			<ModernNavbar></ModernNavbar>
			<Container className={styles.mainContainer}>
				<div className={styles.box}>
					{/* Header */}
					<Row>
						<h2 className={styles.primaryLabel}>Create Account</h2>
						<label className={styles.secondaryLabel}>
							Join us and start your learning journey
						</label>
					</Row>

					{/* Error alert */}
					{error && (
						<div className={styles.errorAlert}>
							<ShieldCheck size={20} />
							<span>{error}</span>
						</div>
					)}

					{/* Badge */}
					<div className={styles.secureSignupBadge}>
						<ShieldCheck size={16} />
						<span>Secure Sign Up</span>
					</div>

					{/* Form */}
					<Row>

						

                            

						<form onSubmit={handleSubmit(onSubmit)} className={styles.mainForm}>
							{/* First name & Last name side by side */}
							<div className={styles.formRow}>
								<Form.Group className={styles.formGroup}>
									{errors.firstname && (
										<span className={styles.errorMessage}>
											{errors.firstname.message}
										</span>
									)}
									<div className={styles.inputWrapper}>
										<User className={styles.inputIcon} size={18} />
										<input
											className={`form-control shadow-none ${styles.input} ${errors.firstname ? styles.inputError : ''}`}
											type="text"
											placeholder="First name"
											{...register('firstname')}
										/>
									</div>
								</Form.Group>

								<Form.Group className={styles.formGroup}>
									{errors.lastname && (
										<span className={styles.errorMessage}>
											{errors.lastname.message}
										</span>
									)}
									<div className={styles.inputWrapper}>
										<User className={styles.inputIcon} size={18} />
										<input
											className={`form-control shadow-none ${styles.input} ${errors.lastname ? styles.inputError : ''}`}
											type="text"
											placeholder="Last name"
											{...register('lastname')}
										/>
									</div>
								</Form.Group>
							</div>

							{/* Email */}
							<Form.Group className={styles.formGroup}>
								{errors.email && (
									<span className={styles.errorMessage}>
										{errors.email.message}
									</span>
								)}
								<div className={styles.inputWrapper}>
									<Mail className={styles.inputIcon} size={18} />
									<input
										className={`form-control shadow-none ${styles.input} ${errors.email ? styles.inputError : ''}`}
										type="email"
										placeholder="Email address"
										{...register('email')}
									/>
								</div>
							</Form.Group>

							{/* Password */}
							<Form.Group className={styles.formGroup}>
								{errors.password && (
									<span className={styles.errorMessage}>
										{errors.password.message}
									</span>
								)}
								<div className={styles.inputWrapper}>
									<Lock className={styles.inputIcon} size={18} />
									<input
										className={`form-control shadow-none ${styles.input} ${errors.password ? styles.inputError : ''}`}
										type="password"
										placeholder="Password"
										{...register('password')}
									/>
								</div>
							</Form.Group>

							{/* Confirm Password */}
							<Form.Group className={styles.formGroup}>
								{errors.confirmPassword && (
									<span className={styles.errorMessage}>
										{errors.confirmPassword.message}
									</span>
								)}
								<div className={styles.inputWrapper}>
									<Lock className={styles.inputIcon} size={18} />
									<input
										className={`form-control shadow-none ${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
										type="password"
										placeholder="Confirm password"
										{...register('confirmPassword')}
									/>
								</div>
							</Form.Group>

							{/* Role Selection */}
							<div className={styles.roleSection}>
								<span className={styles.roleSectionLabel}>I want to join as</span>
								<div className={styles.roleOptions}>
									<label
										className={`${styles.roleCard} ${role === 'student' ? styles.roleCardActive : ''}`}
									>
										<input
											type="radio"
											name="role"
											value="student"
											checked={role === 'student'}
											onChange={() => setRole('student')}
										/>
										<span className={styles.roleIcon}>🎓</span>
										<span className={styles.roleTitle}>Student</span>
										<span className={styles.roleDesc}>Learn & grow</span>
									</label>

									<label
										className={`${styles.roleCard} ${role === 'instructor' ? styles.roleCardActive : ''}`}
									>
										<input
											type="radio"
											name="role"
											value="instructor"
											checked={role === 'instructor'}
											onChange={() => setRole('instructor')}
										/>
										<span className={styles.roleIcon}>🏫</span>
										<span className={styles.roleTitle}>Instructor</span>
										<span className={styles.roleDesc}>Teach & earn</span>
									</label>
								</div>
							</div>

							{/* Submit */}
							<Button
								type="submit"
								className={styles.signupButton}
								disabled={isLoading}
							>
								{isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
							</Button>

							{/* ── Divider ─────────────────────────────────── */}
                            <div className={styles.divider}>
                                <span>or</span>
                            </div>

							{/* ── Google Sign In Button ────────────────────── */}
                            <Button style={
								{
									width: '100%'
								}
							}
                                type="button"
                                variant="outline-secondary"
                                className={styles.googleButton}
                                // onClick={loginWithGoogle}
                                disabled={isLoading}
                            >
                                {/* Google SVG icon */}
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ marginRight: '10px', flexShrink: 0 }}
                                >
                                    <path
                                        fill="#4285F4"
                                        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
                                    />
                                </svg>
                                Continue with Google
                            </Button>

							

							{/* Divider */}
							<div className={styles.divider}>
								<span>or</span>
							</div>

							{/* Back to signin link */}
							<Link href="/signin">
								<p className={styles.signinLink}>
									Already have an account? <span>Sign In</span>
								</p>
							</Link>
						</form>
					</Row>
				</div>
			</Container>
		</div>
	);
};

export default SignupComponent;
