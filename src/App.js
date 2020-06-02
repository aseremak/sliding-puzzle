import React from 'react';
import { connect } from 'react-redux';

import './App.css';
import * as actions from './store/actions';

import GamePanel from './containers/GamePanel/GamePanel';
import UserPanel from './containers/UserPanel/UserPanel';
import Layout from './containers/Layout/Layout';
import Spinner from './components/UI/Spinner/Spinner';
import LangContext from './hoc/context/LangContext';

class App extends React.Component {
	state = {
		availableGames: [ '3x3+', '4x4+', '5x5+', '3x3', '4x4', '5x5' ],
		activePanel: 'user', // 'select-image' / 'user' / 'game'
		boardWidth: null, // 240 / 360 / 420
		game: {
			type: null, // '3x3+',
			size: null, // 3,
			withNumbers: true,
			highscore: 0 // 123, // THIS VALUE EXIST IN highscores TOO, MAY IT SHOULD BE MOVED FROM HERE
		},
		gameStarted: false,
		image: null,
		lang: 'en',
		isStorageEnabled: undefined
	};

	componentDidMount() {
		console.log('[App.js] componentDidMount, isStorageEnabled enabled? ');
		this.getDataFromLocalStorage();
		this.props.getHighscores();
	}

	getDataFromLocalStorage() {
		// CHECK IF storageEnabled AND SET user.personalBests
		console.log('[App.js] getDataFromLocalStorage');
		let personalBests = {};
		let storageEnabled = undefined;
		try {
			const scores = localStorage.getItem('slidePuzzleScores');
			storageEnabled = true;
			if (scores) {
				personalBests = JSON.parse(scores);
			}
		} catch (error) {
			storageEnabled = false;
		}
		this.props.setPersonalBests(personalBests);
		this.setState({
			isStorageEnabled: storageEnabled
		});
	}

	updateWidth(val) {
		// console.log(val);
		let newVal;
		if (val >= 1000) {
			newVal = 420;
		} else if (val >= 800) {
			newVal = 360;
		} else if (val >= 600) {
			newVal = 240;
		} else if (val >= 400) {
			newVal = 360;
		} else {
			newVal = 240;
		}
		this.setState({ boardWidth: newVal });
	}

	userClickedPlayButtonHandler = (game) => {
		this.setState({
			activePanel: 'game',
			game: {
				type: game,
				size: parseInt(game.slice(0, 1)),
				withNumbers: game.endsWith('+'),
				highscore: this.props.highscores[game][0].score
			}
		});
	};

	langSelectHandler = (lang) => {
		this.setState({ lang: lang });
	};

	endGameHandler = () => {
		console.log('[App.js] endGameHandler');
		this.props.getHighscores();
		this.setState({
			activePanel: 'user',
			gameStarted: false
		});
	};

	gameStartedHandler = () => {
		this.setState({ gameStarted: true });
	};

	render() {
		let panel = <Spinner />;
		switch (this.state.activePanel) {
			case 'game':
				const bestScores = {
					highscore: this.state.game.highscore,
					personalBest: this.props.user.personalBests[this.state.game.type]
				};
				panel = (
					<GamePanel
						boardWidth={this.state.boardWidth}
						game={this.state.game}
						gameStarted={this.state.gameStarted}
						image={this.state.image}
						bestScores={bestScores}
						storage={this.state.isStorageEnabled}
						anonymous={this.props.user.anonymous}
						// gameStartedRef={() => this.gameStartedHandler()}
						gameStartedRef={this.gameStartedHandler}
						// endGameRef={() => this.endGameHandler()}
						endGameRef={this.endGameHandler}
					/>
				);
				break;

			default:
				// USERPANEL
				if ((this.props.user.personalBests || !this.state.isStorageEnabled) && this.props.highscores) {
					panel = (
						<UserPanel
							availableGames={this.state.availableGames}
							clickPlay={this.userClickedPlayButtonHandler}
							user={this.props.user}
							highscores={this.props.highscores}
						/>
					);
				}
				break;
		}

		return (
			<div className="App">
				<LangContext.Provider value={{ lang: this.state.lang }}>
					<Layout
						langSelect={this.langSelectHandler}
						storage={this.state.isStorageEnabled}
						widthRef={(val) => this.updateWidth(val)}>
						{panel}
					</Layout>
				</LangContext.Provider>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		highscores: state.highscores,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getHighscores: () => dispatch(actions.highscores_get()),
		setPersonalBests: (personalBest) => dispatch(actions.user_set_personal_bests(personalBest)),
		newPersonalBest: (gameType, time) => dispatch(actions.user_new_personal_best(gameType, time))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
