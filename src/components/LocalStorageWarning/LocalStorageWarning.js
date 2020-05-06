import React from 'react';
import './LocalStorageWarning.css';

const localStorageWarning = (props) => {
	let warning = null;
	if (!typeof Storage) {
		warning = (
			<div className="LocalStorageWarning">
				Web Storage Disabled! Enable this feature to store your best scores!
			</div>
		);
	}

	return warning;
};

export default localStorageWarning;
