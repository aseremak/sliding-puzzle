import React from 'react';
import './Modal.css';

const modal = (props) => {
	let box = null;
	if (props.children !== undefined) {
		box = (
			<div
				className="Box"
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div className="vertCenterDiv">{props.children}</div>
			</div>
		);
	}
	return (
		<div
			className="Modal"
			onClick={(e) => {
				e.stopPropagation();
				if (props.clickCall) {props.clickCall()};
			}}
		>
			{box}
		</div>
	);
};

export default modal;
