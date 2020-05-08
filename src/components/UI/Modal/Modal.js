import React from 'react';
import './Modal.css';

const modal = (props) => {
  let box = null;
  if (props.children !== undefined) {
    box = (
    <div className="Box" onClick={ (e) => {
      console.log('Box clicked'); 
      e.stopPropagation()}
      }>
    {props.children}
  </div>
  )
  }
  return (
    <div className="Modal" onClick={ (e) => {
      console.log('modal clicked'); 
      e.stopPropagation();
      props.clickCall();
      }}>
      {box}
    </div>
  )
};

export default modal;