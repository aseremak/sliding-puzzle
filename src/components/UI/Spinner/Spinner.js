// https://loading.io/css/

import React from 'react';
import './Spinner.css';

const spinner = (props) => {
	let addStyle = null;
	if (props.vMargin) {
		addStyle = {
			marginTop: props.vMargin,
			marginBottom: props.vMargin,
		}
	}

	console.log(addStyle);
	

	return (
		<div className="lds-spinner" style={addStyle}>
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
		</div>
	);
};

export default spinner;
