import React from 'react';
import './LocalStorageWarning.css';

const localStorageWarning = (props) => (
	<div className="LocalStorageWarning stdBlockStrong">
		Web Storage Disabled! Enable this feature to store your best scores!{' '}
		<a href="https://www.google.com/search?q=how+enable+web+storage+in+chrome" target="_new_tab">
			More info
		</a>
	</div>
);

export default localStorageWarning;
