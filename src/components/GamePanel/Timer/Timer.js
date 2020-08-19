import React from 'react';
import './Timer.css';

const timer = (props) => {
  let classes = 'Timer stdBlock';
  if (props.timer % 2 === 1) {
    classes += ' tick';
  }
  return (
    <div className={classes}>{props.timer}</div>
  )
};

export default timer; 