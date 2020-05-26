import React from 'react';
import './Timer.css';

const timer = (props) => {
  return (
    <div className="Timer stdBlock">{props.timer}</div>
  )
};

export default timer; 