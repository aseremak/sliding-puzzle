import React from 'react';
import './GameInfo.css';

const GameInfo = (props) => {
	const classes = props.selected ? 'GameInfo GameInfoSelected' : 'GameInfo',
		personalBest = props.personalBest || '-',
		averagePB = props.averagePB || '-',
		highscore = props.highscore || '-';

	return (
		<div className={classes}>
			<div className="GameInfoName">{props.gameLabel}</div>
			<div className="GameInfoUserPB">{personalBest}</div>
			<div className="GameInfoAvgPB">{averagePB}</div>
			<div className="GameInfoHighscore">{highscore}</div>
			<div className="GameInfoStars">stars</div>
		</div>
	);
};

export default GameInfo;
