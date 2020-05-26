import React from 'react';

const bestScoreItem = (props) => {
  return (
    <div className="BestScoreItem stdBlock">
      {props.caption}: {props.value}
    </div>
  )
};

export default bestScoreItem;