import React from 'react';
import './BestScoreItem.css';

const bestScoreItem = (props) => {
  return (
    <div className="bestScoreItem">
      {props.caption}: {props.value}
    </div>
  )
};

export default bestScoreItem;