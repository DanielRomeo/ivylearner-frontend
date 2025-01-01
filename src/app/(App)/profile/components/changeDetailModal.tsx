import React, { Children, ReactNode, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import styles from './styles/changeDetailsModal.module.scss';
import './styles/changeDetailsModal.css';

interface EditFormModalProps {
	show: boolean;
	onHide: () => void;
	onSave: (value: string) => void;
	title: string;
	initialValue: string;
	bodyChildren?: ReactNode;
	footerChildren?: (onSave2: (value: string) => void) => ReactNode;
}

const EditFormModal: React.FC<EditFormModalProps> = ({
	show,
	onHide,
	onSave,
	title,
	initialValue,
	bodyChildren,
	footerChildren,
}) => {
	const [value, setValue] = useState(initialValue);

	const handleSave2 = () => {
		onSave(value);
		onHide();
	};

	return (
		<Modal className="modal" show={show} onHide={onHide} size="lg">
			<Modal.Header closeButton className="modalHeader">
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>

			<Modal.Body className={`modalBody`}>{bodyChildren}</Modal.Body>
		</Modal>
	);
};

export default EditFormModal;
