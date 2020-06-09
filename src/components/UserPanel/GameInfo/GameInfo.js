import React from 'react';
import './GameInfo.css';
import starGrey from '../../../assets/images/star128g.png';
import starYellow from '../../../assets/images/star128y.png';
import starInvisible from '../../../assets/images/star128inv.png';

const GameInfo = (props) => {
	const personalBest = props.personalBest || '-',
		highscore = props.highscore || '-';
	let classes = 'GameInfo',
		stars = [];
	if (props.selected) {
		classes += ' GameInfoSelected';
	}
	if (props.header) {
		classes += ' GameInfoHeader';
		stars.push(
			<img key="starPB" src={starGrey} alt="grey star" />,
			<img key="starHS" src={starGrey} alt="grey star" />
		);
	} else if (personalBest !== '-') {
		stars.push(<img key="starPB" src={starYellow} alt="gold star" />);
		if (personalBest <= highscore) {
			stars.push(<img key="starHS" src={starYellow} alt="gold star" />);
		}
	} else {
		stars.push(<img key="starInvisible" src={starInvisible} alt="invisible star" />);
	}


	return (
		<div className={classes}>
			<div className="GameInfoName">
				<div className="vertCenterDiv">{props.gameLabel}</div>
			</div>
			<div className="GameInfoUserPB">
				<div className="vertCenterDiv">{personalBest}</div>
			</div>
			<div className="GameInfoHighscore">
				<div className="vertCenterDiv">{highscore}</div>
			</div>
			<div className="GameInfoStars">
				<div className="vertCenterDiv">{stars}</div>
			</div>
		</div>
	);
};

export default GameInfo;
