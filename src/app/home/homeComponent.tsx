'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import styles from './homeComponent.module.scss'

export default function HomeComponent() {
	// const router = useRouter();

	// useEffect(() => {
	// 	router.push('/commerce');
	// }, []);

	return (
		<div>
			<Container className={styles.container}>
				{/* <h1 style={tempStyleDecoration}>
					<Link href="/">IVYlearner Software</Link>
				</h1> */}

				<div className={styles.box}>
					<small>This is a private demonstration of the IVYlearner site. (unstyled)</small>
					<hr/>
					<small>This is demonstration of where you will see changes whenever releases are made. The login and signup buttons dont work yet</small>
					<hr />
					<h1>IVY LEARNER</h1>
					<Link href={`/signin`}>Signin</Link>
					<br/>
					<Link href={`/signup`}>Signup</Link>
				</div>

				

				
			</Container>
		</div>
	);
}

const tempStyleDecoration = {
	color: 'blue',
	textDecoration: 'underline',
};
