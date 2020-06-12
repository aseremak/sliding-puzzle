import React from 'react';
import './BestScores.css';
import BestScoreItem from './BestScoreItem/BestScoreItem';
import LangContext from '../../../hoc/context/LangContext';
import { txt } from '../../../shared/dict';

const bestScores = (props) => {
	const personalBest = props.bestScores.personalBest || 0;
	const highscore = props.bestScores.highscore || 0;
	return (
		<LangContext.Consumer>
			{(context) => (
				<div className="BestScores">
					<BestScoreItem caption={txt.PERSONAL_BEST[context.lang]} value={personalBest} />
					<BestScoreItem caption={txt.HIGHSCORE[context.lang]} value={highscore} />
				</div>
			)}
		</LangContext.Consumer>
	);
};

export default bestScores;
