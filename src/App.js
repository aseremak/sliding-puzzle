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
		availableGames: [ '3x3', '4x4', '5x5' ],
		activePanel: 'user', // 'select-image' / 'user' / 'game'
		boardWidth: null, // 240 / 360 / 420
		game: {
			type: null, // '3x3+',
			size: null, // 3,
			withNumbers: true,
			highscore: 999 // 123, // THIS VALUE EXIST IN highscores TOO, MAY IT SHOULD BE MOVED FROM HERE
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

	userBrokePersonalBest = (gameType, time) => {
		console.log('[App.js] userBrokePersonalBest - args:', gameType, time);
		if (this.props.user.anonymous) {
			// UPDATE LOCAL STORAGE SCORES
			if (this.state.isStorageEnabled) {
				let scores = localStorage.getItem('slidePuzzleScores');
				let updatedScores = {};
				if (scores) {
					updatedScores = JSON.parse(scores);
					console.log(updatedScores);
					updatedScores[gameType] = time;
				} else {
					updatedScores = {
						[gameType]: time
					};
				}
				localStorage.setItem('slidePuzzleScores', JSON.stringify(updatedScores));
				console.log('[App.js] personal best saved in localStorage.');
			}
		}
		this.props.newPersonalBest(gameType, time);
	};

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
		const gameObj = { ...this.state.game };
		gameObj.type = game;
		gameObj.size = parseInt(game.slice(0, 1));
		gameObj.withNumbers = game.endsWith('+');
		this.setState({
			activePanel: 'game',
			game: gameObj
		});
	};

	langSelectHandler = (lang) => {
		this.setState({ lang: lang });
	};

	GameHandler = () => {
		console.log('[App.js] GameHandler');
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
						// endGameRef={() => this.GameHandler()}
						endGameRef={this.GameHandler}
						callUserBrokePersonalBest={(type, time) => this.userBrokePersonalBest(type, time)}
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
