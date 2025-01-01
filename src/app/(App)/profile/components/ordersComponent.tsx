'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Form, Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import styles from '../../_styles/ordersComponent.module.scss';
import ResponsiveImage from '../../_components/ResponsiveImage';
import { Order } from '../../_components/Interfaces';
import { orderExample } from '../../_components/InterfacesExamples';

import ShowOrderModal from './showOrderModal';

//
const OrdersComponent = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [orders, setOrders] = useState<Order[]>([...orderExample]);

	// before i start using the actual cart, I should first build up how the order page looks like, then i will use this:
	console.log(orders);

	const [showModal, setShowModal] = useState(false);

	const handleClose = () => setShowModal(false);
	const handleShow = () => setShowModal(true);

	return (
		<div className={styles.main}>
			{orders.length > 0 ? (
				orders.map((order: any) => (
					<Container className={styles.mainContainer}>
						<Row className={styles.mainRow}>
							<Col className={styles.firstCol}>
								<h3>Delivered on 12 March 2022</h3>
							</Col>
							<Col className={styles.secondCol}>
								<Button onClick={handleShow} className={styles.viewOrderDetails}>
									View order details
								</Button>
							</Col>
						</Row>
						<hr />
						<Row className={styles.secondRow}>
							<Col xs={3} className={styles.imageCol}>
								<ResponsiveImage
									className={styles.image}
									alt={''}
									src={'/adidasMANU.jpg'}
									height={100}
									width={100}
								/>
							</Col>
						</Row>
					</Container>
				))
			) : (
				<Container className={styles.mainContainer}>
					<Row className={styles.mainRow}>
						<Col className={styles.col}>
							<FaBoxOpen className={styles.icon} size="4x" />
							<p>You don't have any orders yet.</p>
							<hr />
							<Button className={styles.goToShoppingButton}>Go to shopping</Button>
						</Col>
					</Row>
				</Container>
			)}

			{/* Modal : */}
			<ShowOrderModal show={showModal} handleClose={handleClose} />
		</div>
	);
};

export default OrdersComponent;
