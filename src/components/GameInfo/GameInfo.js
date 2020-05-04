import React from 'react';
import './GameInfo.css';

const GameInfo = (props) => {
  const classes = props.selected ? 'GameInfo GameInfoSelected' : 'GameInfo'; 
	return (
		<div className={classes}>
			<div className="GameInfoName">{props.gameLabel}</div>
			<div className="GameInfoUserBestScore">brak</div>
			<div className="GameInfoBestScore">brak</div>
			<div className="GameInfoAvgScore">brak</div>
			<div className="GameInfoStars">brak</div>
		</div>
	);
};

export default GameInfo;
