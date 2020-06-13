import React, { Component } from 'react';

import './HighscoresPanel.css';

import HighscoresTable from '../../components/HighscoresPanel/HighscoresTable/HighscoresTable';
import Button from '../../components/UI/Button/Button';

import LangContext from '../../hoc/context/LangContext';
import { txt } from '../../shared/dict';

class HighscoresPanel extends Component {
	state = { withNumbers: true };
	static contextType = LangContext;

	componentDidMount() {
		if (this.props.newHighscore) {
			this.setState({ withNumbers: this.props.newHighscore.gameType.endsWith('+') });
		}
	}

	onNextPageClickHandler = () => {
		this.setState((prevState) => {
			return { withNumbers: !prevState.withNumbers };
		});
	};

	render() {
		let tables = null;
		if (this.props.highscores) {
			tables = Object.keys(this.props.highscores)
				.filter((type) => {
					return type.endsWith('+') === this.state.withNumbers;
				})
				.map((type) => {
					let data = this.props.highscores[type];
					if (data.length < 10) {
						data = data.concat(
							Array(10 - data.length).fill({
								score: 99999,
								username: '---'
							})
						);
					}
					const caption = type.endsWith('+')
						? type.slice(0, type.length - 1) + txt.WITH_NUMBERS[this.context.lang]
						: type;
					let rowWithStar = null;
					if (this.props.newHighscore && type === this.props.newHighscore.gameType ) {
						rowWithStar = this.props.newHighscore.rank
					}	
					
					return <HighscoresTable 
						username={this.props.username} 
						key={type} 
						caption={caption} 
						rowWithStar={rowWithStar}
						data={data} />;
				});
		}

		const switchPageButton = this.state.withNumbers
			? txt.NEXT_PAGE[this.context.lang]
			: txt.FIRST_PAGE[this.context.lang];

		return (
			<div>
				<div className="TablesContainer">
					{tables}
					<div className="ButtonsContainer">
						<Button callClick={this.onNextPageClickHandler}>{switchPageButton}</Button>
						<Button callClick={this.props.callClose}>{txt.CLOSE[this.context.lang]}</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default HighscoresPanel;
