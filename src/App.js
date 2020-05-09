import React from 'react';
import './App.css';
import axios from 'axios';
import GamePanel from './containers/GamePanel/GamePanel';
import UserPanel from './containers/UserPanel/UserPanel';
import Layout from './containers/Layout/Layout';
import Spinner from './components/Spinner/Spinner';

import LangContext from './hoc/context/LangContext';

class App extends React.Component {
	state = {
		availableGames: [ '3x3', '4x4', '5x5' ],
		user: {
			username: 'anonymous',
			email: null,
			personalBests: undefined
		},
		activePanel: 'user', // 'select-image' / 'user' / 'game'
		boardWidth: null, // 240 / 360 / 420
		game: {
			type: null, // '3x3+',
			size: null, // 3,
			withNumbers: true,
			highscore: 999 // 123, // THIS VALUE EXIST IN highscores TOO, MAY IT SHOULD BE MOVED FROM HERE
		},
		highscores: undefined,
		gameStarted: false,
		image: null,
		lang: 'en',
		storage: typeof Storage ? true : false // CHECK IF THIS IS NEEDED
	};

	componentDidMount() {
		console.log('[App.js] componentDidMount');
		this.getDataFromLocalStorage();
		this.getDataFromServer();
	}

	getDataFromLocalStorage() {
		console.log('[App.js] getDataFromLocalStorage');
		const 
			user = {...this.state.user},
			personalBests = {};
		let storageEnable = undefined;
		try {
			let storage = localStorage;
			storageEnable = true;
			for (const key in storage) {
				if (key) {
					personalBests[key] = localStorage[key];
				}
			}
		} catch (error) {
			console.log('Web Storage Disabled, no data');
			alert('Web Storege Disabled!')
			storageEnable = false;
		}
		user.personalBests = personalBests;
		this.setState({
			user: user,
			storage: storageEnable
		})
		console.log(user);
	}

	getDataFromServer() {
		console.log('[App.js] getDataFromServer');
		axios.get('https://slide-puzzle-as.firebaseio.com/highscores.json')
			.then( (res) => {
				console.log('[App.js] then');
				if(res.data) {
					this.setState({highscores: res.data});
				} else {
					alert('unable to load highscores...')
					this.setState({highscores: {}});
				}
			})
			.catch( (error) => {
				console.log('[App.js] error');
				console.log(error)
			})
	}

	userBrokePersonalBest = (gameType, time) => {
		console.log('[App.js] userBrokePersonalBest - args:', gameType, time);
		
		const user = {...this.state.user};
		user.personalBests[gameType] = time;
		this.setState({ user: user})
		if(this.state.storage) {
			localStorage.setItem(gameType, time);
		};
		// ADD CODE TO SEND PERSONAL BEST TO SERVER
		console.log('[App.js] personal best saved in localStorage.', user);
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
		// GameHandler() {
		console.log('[App.js] GameHandler');
		this.setState({
			activePanel: 'user',
			gameStarted: false
		});
	}

	gameStartedHandler = () => {
		this.setState({ gameStarted: true });
	}

	render() {
		let panel = null;
		switch (this.state.activePanel) {
			case 'game':
				const bestScores = {
					highscore: this.state.game.highscore,
					personalBest: this.state.user.personalBests[this.state.game.type]
					// personalBest: this.state.user.personalBests
					// 	? this.state.user.personalBests[this.state.game.type]
					// 	: null
				};
				panel = (
					<GamePanel
						boardWidth={this.state.boardWidth}
						game={this.state.game}
						gameStarted={this.state.gameStarted}
						image={this.state.image}
						bestScores={bestScores}
						storage={this.state.storage}
						anonymous={this.state.user.username === 'anonymous'}
						gameStartedRef={() => this.gameStartedHandler()}
						endGameRef={() => this.GameHandler()}
						callUserBrokePersonalBest={(type, time) => this.userBrokePersonalBest(type, time)}
					/>
				);
				break;

			default:
				// USERPANEL
				if ((this.state.user.personalBests || !this.state.storage) && this.state.highscores) {
					panel = (
						<UserPanel
							availableGames={this.state.availableGames}
							clickPlay={this.userClickedPlayButtonHandler}
							user={this.state.user}
							highscores={this.state.highscores}
						/>
					);
				} else {
					panel = <Spinner />;
				}
				break;
		}

		return (
			<div className="App">
				<LangContext.Provider value={{ lang: this.state.lang }}>
					<Layout
						langSelect={this.langSelectHandler}
						username={this.state.user.username}
						storage={this.state.storage}
						anonymous={this.state.user.username === 'anonymous'}
						widthRef={(val) => this.updateWidth(val)}
					>
						{panel}
					</Layout>
				</LangContext.Provider>
			</div>
		);
	}
}

export default App;
