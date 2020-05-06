import React from 'react';
import './BestScores.css';
import BestScoreItem from './BestScoreItem/BestScoreItem';

const bestScores = (props) => {
  const personalBest = props.bestScores.personalBest || 0;
  const highscore = props.bestScores.highscore || 0;
  return (
    <div className='BestScores'>
      <BestScoreItem caption="Personal Best" value={personalBest} />
      <BestScoreItem caption="High Score" value={highscore} />
    </div>
  )
};

export default bestScores;