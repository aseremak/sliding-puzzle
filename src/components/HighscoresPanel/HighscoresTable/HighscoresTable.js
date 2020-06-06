import React from 'react';

const highscoresTable = (props) => {
	const rows = props.data.map((highscore, index) => {
		return (
      <li key={index} className="stdBlock">
        <div className="Col1">{index + 1}</div>
        <div className="Col2">{highscore.username}</div>
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
