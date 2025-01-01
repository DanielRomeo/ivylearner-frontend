'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from '../_styles/buyComponent.module.scss';
import AlertDismissible from '../_components/DismissableAlert';
import Link from 'next/link';

const ForgotPasswordComponent = () => {
	const [quantity, setQuantity] = useState(1);

	return (
		<div className={styles.main}>
			<Container>
				<h5>Forogt your password? </h5>
			</Container>
		</div>
	);
};

export default ForgotPasswordComponent;
