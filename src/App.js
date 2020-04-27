import React from 'react';
import './App.css';
// import PuzzleArray from './PuzzleArray';
// import PuzzleBoard from './components/PuzzleBoard/PuzzleBoard';
import GamePanel from './containers/GamePanel/GamePanel';
// import puzzlePiece from './components/PuzzlePiece/PuzzlePiece';
import Layout from './/containers/Layout/Layout';

class App extends React.Component {
	state = {
		user: 'anonynous',
		activePanel: 'game', // 'select-image' / 'user'
		boardWidth: 240, // 240 / 360 / 420
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

	render() {
		const panel = <GamePanel settings={this.state} />;

		return (
			<div className="App">
				<Layout widthRef={(val) => this.updateWidth(val)}>
					{panel}
					<p>{this.state.boardWidth}</p>
				</Layout>
			</div>
		);
	}
}

export default App;
