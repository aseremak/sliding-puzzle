import React from 'react';
import './App.css';
import GamePanel from './containers/GamePanel/GamePanel';
import Layout from './/containers/Layout/Layout';

class App extends React.Component {
	state = {
		user: 'anonynous',
		activePanel: 'game', // 'select-image' / 'user'
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
    if(val >= 950) {
      newVal = 420
    } else if (val >= 760) {
      newVal = 360
    } else {
      newVal = 240
    }
		this.setState({ boardWidth: newVal });
	}

	gameStartedHandler() {
		console.log('Game started!');
		this.setState({gameStarted: true})
	}

	render() {
		const panel = <GamePanel 
			boardWidth = {this.state.boardWidth}
			gameType = {this.state.gameType}
			gameStarted = {this.state.gameStarted}
			image = {this.state.image}
			gameStartedRef = {() => this.gameStartedHandler()}
		/>;
		
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
