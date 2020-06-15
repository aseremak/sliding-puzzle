import React from 'react';
import starYellow from '../../../assets/images/star128y.png';


const highscoresTable = (props) => {
	const rows = props.data.map((highscore, index) => {
		let classes = 'stdBlock';
		if (props.username === highscore.username) {
			classes += ' CurrentUser';
		}
		const star = props.rowWithStar !== null && index === props.rowWithStar ? <img src={starYellow} alt="gold star" /> : null;
		return (
      <li key={index} className={classes}>
        <div className="Col1">{index + 1}</div>
				<div className="Col2">{highscore.username}{star}</div>
        <div className="Col3">{highscore.score}</div>
      </li>)
	});

	return (
		<div className="HighscoresTable">
			<ul>
				<li className="stdBlockStrong">{props.caption}</li>
        {rows}
			</ul>
		</div>

	);
};

export default highscoresTable;
