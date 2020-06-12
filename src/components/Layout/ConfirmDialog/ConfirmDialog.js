import React from 'react';
import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button/Button';

import LangContext from '../../../hoc/context/LangContext';
import { txt } from '../../../shared/dict';

const confirmDialog = (props) => {
	return (
		<LangContext.Consumer>
			{(context) => (
				<Modal>
					<p>{props.message}</p>
					<p>{txt.WANT_CONTINUE[context.lang]}</p>
					<br />
					<Button callClick={props.callConfirmYes}>{txt.YES[context.lang]}</Button>
					<Button callClick={props.callConfirmNo}>{txt.NO[context.lang]}</Button>
				</Modal>
			)}
		</LangContext.Consumer>
	);
};

export default confirmDialog;
