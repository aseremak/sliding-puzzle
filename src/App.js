import React from 'react';
import { connect } from 'react-redux';

import './App.css';
import * as actions from './store/actions';

import GamePanel from './containers/GamePanel/GamePanel';
import UserPanel from './containers/UserPanel/UserPanel';
import HighscoresPanel from './containers/HighscoresPanel/HighscoresPanel';

import Layout from './containers/Layout/Layout';
import Spinner from './components/UI/Spinner/Spinner';
import LangContext from './hoc/context/LangContext';

const AVAILABLE_GAMES = [ '3x3+', '4x4+', '5x5+', '3x3', '4x4', '5x5' ];

class App extends React.Component {
	state = {
		// availableGames: [ '3x3+', '4x4+', '5x5+', '3x3', '4x4', '5x5' ],
		boardWidth: null, // 240 / 360 / 420
		game: {
			type: null, // '3x3+',
			size: null, // 3,
			withNumbers: true,
			highscore: 0 // THIS VALUE EXIST IN highscores TOO, MAY IT SHOULD BE MOVED FROM HERE
		},
		// timerStarted: false,
		image: null,
		lang: 'en',
		isStorageEnabled: undefined
	};

	componentDidMount() {
		this.getDataFromLocalStorage();
		this.props.getHighscores();
		this.props.authAutoLogin();
	}

	getDataFromLocalStorage() {
		// CHECK IF storageEnabled AND SET user.personalBests
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
			game: {
				type: game,
				size: parseInt(game.slice(0, 1)),
				withNumbers: game.endsWith('+'),
				highscore: this.props.highscores[game][0].score
			}
		});
		this.props.gamePanelOpen();
	};

	langSelectHandler = (lang) => {
		this.setState({ lang: lang });
	};

	endGameHandler = () => {
		this.props.getHighscores();
		this.props.timerStop();
		this.props.gamePanelClose();
	};

	clearPersonalBestsHandler = () => {
		if (this.state.isStorageEnabled) {
			localStorage.removeItem('slidePuzzleScores');
			this.getDataFromLocalStorage();
		}
	}	

	closeHighscoresPanelHandler = () => {
		this.props.highscoresPanelClose();
	}

	openHighscoresPanelHandler = () => {
		this.props.highscoresPanelOpen();
	}

	render() {
		let panel = <Spinner />;
		switch (this.props.activePanel) {
			case 'game':
				const bestScores = {
					highscore: this.state.game.highscore,
					personalBest: this.props.user.personalBests[this.state.game.type]
				};
				panel = (
					<GamePanel
						boardWidth={this.state.boardWidth}
						game={this.state.game}
						image={this.state.image}
						bestScores={bestScores}
						storage={this.state.isStorageEnabled}
						anonymous={this.props.user.anonymous}
						endGameRef={this.endGameHandler}
					/>
				);
				break;

			case 'highscores':
				panel = <HighscoresPanel 
					highscores={this.props.highscores}
					callClose = {this.closeHighscoresPanelHandler}
					/>
				break;

			default:
				// USERPANEL
				if ((this.props.user.personalBests || !this.state.isStorageEnabled) && this.props.highscores) {
					panel = (
						<UserPanel
							availableGames={AVAILABLE_GAMES}
							clickPlay={this.userClickedPlayButtonHandler}
							user={this.props.user}
							highscores={this.props.highscores}
							callOpenHighscores={this.openHighscoresPanelHandler}
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
						clearPersonalBestCall={this.clearPersonalBestsHandler}
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
		activePanel: state.activePanel,
		highscores: state.highscores,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getHighscores: () => dispatch(actions.highscoresGet()),
		setPersonalBests: (personalBest) => dispatch(actions.userSetPersonalBests(personalBest)),
		newPersonalBest: (gameType, time) => dispatch(actions.userNewPersonalBest(gameType, time)),
		gamePanelOpen: () => dispatch(actions.gamePanelOpen()),
		gamePanelClose: () => dispatch(actions.gamePanelClose()),
		highscoresPanelOpen: () => dispatch(actions.highscoresPanelOpen()),
		highscoresPanelClose: () => dispatch(actions.highscoresPanelClose()),
		timerStop: () => dispatch(actions.timerStop()),
		authAutoLogin: () => dispatch(actions.authAutoLogin()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
