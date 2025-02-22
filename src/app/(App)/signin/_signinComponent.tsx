'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Form, Button, Container, Row, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import styles from '../_styles/signinComponent.module.scss';
import { useAuth } from '../../contexts/auth-context';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required.'),
  password: yup.string().required('Password is required.'),
});

const SigninComponent = () => {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data: any) => {
    try {
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

              <div className={styles.divider}>
                <span>or</span>
              </div>

              <Link href="signup">
                <p className={styles.createAccountLink}>
                  New to our platform? <span>Create an account</span>
                </p>
              </Link>

              <Link href="signup-tutor">
                <p className={styles.tutorLink}>
                  Want to become an instructor? <span>Join as teacher</span>
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