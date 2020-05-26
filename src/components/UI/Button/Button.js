import React from 'react';
import './Button.css';

const button = (props) => {
  return (
    <button
      className="Button stdBlock"
      disabled={props.disabled}
      onClick={props.callClick}
    >
      {props.children}
    </button>
  )
};

export default button;