import React from 'react';
import './Timer.css';

const timer = (props) => {
  return (
    <div className="Timer">{props.timer}</div>
  )
};

export default timer; 