import React from 'react';
import './App.css';
import GamePanel from './containers/GamePanel/GamePanel';
import UserPanel from './containers/UserPanel/UserPanel';
import Layout from './/containers/Layout/Layout';

class App extends React.Component {
	state = {
		availableGames: ['3x3', '4x4', '5x5'],
		user: 'anonynous',
		activePanel: 'user', // 'select-image' / 'user' / 'game'
		boardWidth: null, // 240 / 360 / 420
		gameType: {
			size: 3,
			withNumbers: true
    },
    gameStarted: false,
		image: null
	};

	updateWidth(val) {
    // console.log(val);
    let newVal;
    if(val >= 1000) {
			newVal = 420
    } else if (val >= 800) {
			newVal = 360
		} else if (val >= 600) {
			newVal = 240
		} else if (val >=400 ) {
			newVal = 360
		} else {
			newVal = 240
		}
		this.setState({ boardWidth: newVal });
	}

	gameStartedHandler() {
		this.setState({gameStarted: true})
	}

	userClickedPlayButtonHandler = (gameType) => {
		this.setState({
			activePanel: 'game',
			gameType: {
				size: parseInt(gameType.slice(0,1)),
				withNumbers: gameType.endsWith('+')
			},			
		});
	}

	render() {
		let panel = null;
		switch (this.state.activePanel) {
			case 'game':
				panel = <GamePanel 
					boardWidth = {this.state.boardWidth}
					gameType = {this.state.gameType}
					gameStarted = {this.state.gameStarted}
					image = {this.state.image}
					gameStartedRef = {() => this.gameStartedHandler()}
				/>;				
				break;
		
			default: // USERPANEL
				panel = <UserPanel
					user={this.state.user}
					availableGames={this.state.availableGames}
					clickPlay={this.userClickedPlayButtonHandler}
					/>;
				break;
		}
		
		return (
			<div className="App">
				<Layout widthRef={(val) => this.updateWidth(val)}>
					{panel}
				</Layout>
			</div>
		);
	}
}

export default App;
