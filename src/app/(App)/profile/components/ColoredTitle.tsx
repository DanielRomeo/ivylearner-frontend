import React, { useState } from 'react';
import Link from 'next/link';
import { Form, Button, Container, Row, Col, InputGroup, Card } from 'react-bootstrap';

interface ColoredTitleProps {
	title: string;
}

const ColoredTitle: React.FC<ColoredTitleProps> = ({ title }) => {
	const firstTwoLetters = title.substring(0, 2);
	const remainingLetters = title.substring(2);

	return (
		<div>
			<h2>
				<span style={{ color: '#ec6919', textDecoration: 'underline' }}>
					{firstTwoLetters}
				</span>
				<span style={{ color: '#231b4a' }}>{remainingLetters}</span>
			</h2>
		</div>
	);
};

export default ColoredTitle;
