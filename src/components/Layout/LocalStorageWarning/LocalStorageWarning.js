import React from 'react';
import './LocalStorageWarning.css';
import LangContext from '../../../hoc/context/LangContext';
import { txt } from '../../../shared/dict';

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
		<LangContext.Consumer>
			{(context) => (
				<div className="LocalStorageWarning stdBlockStrong">
					{txt.WEB_STORAGE_WARNING[context.lang]}
					<a href={'https://www.google.com/search?q=how+enable+web+storage+in+' + browser} target="_new_tab">
						{txt.HOW_TO_DO[context.lang]}
					</a>
				</div>
			)}
		</LangContext.Consumer>
	);
};

export default localStorageWarning;
