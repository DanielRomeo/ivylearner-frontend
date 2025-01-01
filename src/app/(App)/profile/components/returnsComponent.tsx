'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Form, Button, Container, Row, Col, InputGroup, Card } from 'react-bootstrap';
import styles from '../../_styles/returnComponent.module.scss';

import ColoredTitle from './ColoredTitle';

// --------------------------

const ReturnsComponents = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	return (
		<div className={styles.main}>
			<Container className={styles.mainContainer}>
				<Row>
					<ColoredTitle title={'Returns'}></ColoredTitle>
					<Card className={styles.card}>
						<Card.Body>
							<Row className="align-items-center">
								<Col>
									<p>
										If you have an item you wish to return, please send us an
										email on : <strong>info@ivydalefashion.co.za</strong>
									</p>
									<p>
										In the email, describe the name of the item you purchased,
										your shipping address, and your contact details.
									</p>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Row>
			</Container>
		</div>
	);
};

export default ReturnsComponents;
