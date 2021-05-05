import React, { useContext } from 'react';
import './MessageBox.css';
import Button from "../Button/Button";

import LangContext from "../../../hoc/context/LangContext";
import { txt } from "../../../shared/dict";


const MessageBox = ({ message, onClick }) => {

	const context = useContext(LangContext);

	return <div className="stdBlock MessageBox">
		<div className="MessageBoxMessage">
		{message}
		</div>
		<Button 
            disabled={false}
            callClick={onClick}
          >
            {txt.CLOSE[context.lang]}
          </Button>
	</div>


}

export default MessageBox;