import React, { Component } from 'react';

import './HighscoresPanel.css';

import HighscoresTable from '../../components/HighscoresPanel/HighscoresTable/HighscoresTable';
import Button from '../../components/UI/Button/Button';

class HighscoresPanel extends Component {
	state = { withNumbers: true };

	onNextPageClickHandler = () => {
		this.setState((prevState) => {
			return { withNumbers: !prevState.withNumbers };
		});
	};

	render() {
		const tables = Object.keys(this.props.highscores)
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

				const caption = type.endsWith('+') ? type.slice(0, type.length - 1) + ' with numbers' : type;

				return <HighscoresTable key={type} caption={caption} data={data} />;
			});

		return (
			<div>
				<div className="TablesContainer">{tables}
				<div className="ButtonsContainer">
				<Button callClick={this.onNextPageClickHandler}>
					{this.state.withNumbers ? 'Next Page' : 'First Page'}
				</Button>
				<Button callClick={this.props.callClose}>Close</Button>
				</div>				

				</div>
			</div>
		);
	}
}

export default HighscoresPanel;
