import React from 'react';
// import './ConfirmDialog.css';
import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button/Button';

const confirmDialog = (props) => {
	return (
		<Modal>
			<p>{props.message}</p>
			<p>Do you want to continue?</p>
			<br />
			<Button callClick={props.callConfirmYes}>YES</Button>
			<Button callClick={props.callConfirmNo}>NO</Button>
		</Modal>
	);
};

export default confirmDialog;
