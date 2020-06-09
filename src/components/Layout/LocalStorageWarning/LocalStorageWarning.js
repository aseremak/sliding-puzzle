import React from 'react';
import './LocalStorageWarning.css';

const localStorageWarning = (props) => {
	let browser = 'Chrome';

	if (navigator.userAgent.indexOf('Opera') !== -1 || navigator.userAgent.indexOf('OPR') !== -1) {
		browser = 'Opera';
	} else if (navigator.userAgent.indexOf('Edg') !== -1) {
		browser = 'Microsoft+Edge';
	} else if (navigator.userAgent.indexOf('Chrome') !== -1) {
		browser = 'Chrome';
	} else if (navigator.userAgent.indexOf('Safari') !== -1) {
		browser = 'Safari';
	} else if (navigator.userAgent.indexOf('Firefox') !== -1) {
		browser = 'Firefox';
	} else if (navigator.userAgent.indexOf('MSIE') !== -1 || !!document.documentMode === true) {
		//IF IE > 10
		browser = 'IE';
	}

	return (
		<div className="LocalStorageWarning stdBlockStrong">
			Web Storage Disabled! Enable this feature to store your best scores!{' '}
			<a href={'https://www.google.com/search?q=how+enable+web+storage+in+' + browser} target="_new_tab">
				More info
			</a>
		</div>
	);
};

export default localStorageWarning;
