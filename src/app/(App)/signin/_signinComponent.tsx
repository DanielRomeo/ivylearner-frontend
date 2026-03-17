'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Form, Button, Container, Row, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';

import styles from '../_styles/signinComponent.module.scss';
import ModernNavbar from '../_components/MainNavbar';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required.'),
    password: yup.string().required('Password is required.'),
});

interface SigninFormData {
    email: string;
    password: string;
}

const SigninComponent = () => {
    const { login, loginWithGoogle } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SigninFormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: SigninFormData) => {
        try {
            setError('');
            setIsLoading(true);
            await login(data.email, data.password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.main}>
            <ModernNavbar />
            <Container className={styles.mainContainer}>
                <div className={styles.box}>
                    <Row>
                        <h2 className={styles.primaryLabel}>Welcome Back</h2>
                        <label className={styles.secondaryLabel}>
                            Sign in to continue your learning journey
                        </label>
                    </Row>

                    {error && (
                        <div className={styles.errorAlert}>
                            <ShieldCheck size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className={styles.secureLoginBadge}>
                        <Lock size={16} />
                        <span>Secure Login</span>
                    </div>

                    <Row>
                        <form onSubmit={handleSubmit(onSubmit)} className={styles.mainForm}>
                            <Form.Group className={styles.formGroup}>
                                {errors.email && (
                                    <span className={styles.errorMessage}>
                                        {errors.email.message}
                                    </span>
                                )}
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} size={18} />
                                    <input
                                        className={`form-control shadow-none ${styles.input}`}
                                        type="email"
                                        {...register('email')}
                                        placeholder="Email address"
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className={styles.formGroup}>
                                {errors.password && (
                                    <span className={styles.errorMessage}>
                                        {errors.password.message}
                                    </span>
                                )}
                                <InputGroup className={styles.inputGroup}>
                                    <div className={styles.inputWrapper}>
                                        <Lock className={styles.inputIcon} size={18} />
                                        <Form.Control
                                            className={`form-control shadow-none ${styles.input}`}
                                            {...register('password')}
                                            type="password"
                                            placeholder="Enter password"
                                        />
                                    </div>
                                    <Link href="/forgotpassword">
                                        <Button
                                            variant="outline-secondary"
                                            className={styles.forgotPasswordButton}
                                        >
                                            Forgot password?
                                        </Button>
                                    </Link>
                                </InputGroup>
                            </Form.Group>

                            <Button
                                type="submit"
                                className={styles.loginButton}
                                disabled={isLoading}
                            >
                                {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
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
                                onClick={loginWithGoogle}
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

                             {/* ── Divider ─────────────────────────────────── */}
                            <div className={styles.divider}>
                                <span>or</span>
                            </div>

                            <Link href="signup">
                                <p className={styles.createAccountLink}>
                                    New to our platform? <span>Create an account</span>
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