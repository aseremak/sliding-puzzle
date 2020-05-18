import React from 'react';
import './GameInfo.css';

const GameInfo = (props) => {
	const
		personalBest = props.personalBest || '-',
		averagePB = props.averagePB || '-',
		highscore = props.highscore || '-';
	let 
		classes = 'GameInfo',
		vertCenterDiv = null;
	if (props.selected) {
		classes += ' GameInfoSelected'
	};
	if (props.header) {
		classes += ' GameInfoHeader';
		vertCenterDiv = 'vertCenterDiv';
	};
	
	return (
		<div className={classes}>
			<div className="GameInfoName"><div className={vertCenterDiv}>{props.gameLabel}</div></div>
			<div className="GameInfoUserPB"><div className={vertCenterDiv}>{personalBest}</div></div>
			<div className="GameInfoAvgPB"><div className={vertCenterDiv}>{averagePB}</div></div>
			<div className="GameInfoHighscore"><div className={vertCenterDiv}>{highscore}</div></div>
			<div className="GameInfoStars"><div className={vertCenterDiv}>stars</div></div>
		</div>
	);
};

export default GameInfo;
