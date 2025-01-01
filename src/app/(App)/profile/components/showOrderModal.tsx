import React from 'react';
import { Modal, Row, Col, Badge } from 'react-bootstrap';
import { FaMapMarkerAlt, FaTruck, FaFileInvoiceDollar, FaCreditCard } from 'react-icons/fa';

const ShowOrderModal = ({ show, handleClose }: any) => {
	return (
		<Modal show={show} onHide={handleClose} size="lg">
			<Modal.Header closeButton>
				<Modal.Title>Order Details</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="order-details">
					<div className="d-flex justify-content-between align-items-center mb-3">
						<h5 className="mb-0">Order #111878413</h5>
						<div>
							<Badge bg="secondary" className="me-2">
								ORDERED 11 AUG 2022
							</Badge>
							<Badge bg="success">PAID 11 AUG 2022</Badge>
						</div>
					</div>

					<Row>
						<Col md={4}>
							<h6>
								<FaMapMarkerAlt /> Takealot Pickup Point
							</h6>
							<p className="mb-0">Polokwane Pickup Point</p>
							<p className="mb-0">73 Silicon Street</p>
							<p className="mb-0">Polokwane</p>
							<p className="mb-0">Polokwane</p>
							<p>0699</p>
						</Col>

						<Col md={4}>
							<h6>
								<FaTruck /> Delivery Method
							</h6>
							<p>Standard Collect</p>

							<h6 className="mt-4">
								<FaCreditCard /> Payment Method
							</h6>
							<p>Credit / Debit Card</p>
						</Col>

						<Col md={4}>
							<h6>
								<FaFileInvoiceDollar /> Order Summary
							</h6>
							<div className="d-flex justify-content-between">
								<span>1 Item</span>
								<span>R 320</span>
							</div>
							<div className="d-flex justify-content-between">
								<span>Collection fee</span>
								<span>R 30</span>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<strong>Order Total:</strong>
								<strong>R 350</strong>
							</div>
							<div className="d-flex justify-content-between text-success">
								<span>Paid (Credit / Debit Card)</span>
								<span>-R 350</span>
							</div>
						</Col>
					</Row>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default ShowOrderModal;
