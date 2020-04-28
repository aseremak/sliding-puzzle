import React from 'react';
import PuzzleArray from '../../PuzzleArray';
import PuzzleBoard from '../../components/PuzzleBoard/PuzzleBoard';
import Auxi from '../../hoc/Auxi/Auxi';
import Timer from '../../components/Timer/Timer';

let puzzleArr = [];

class GamePanel extends React.Component {
	constructor(props) {
		super(props);
    const size = this.props.gameType.size;
    const pieceWidth = this.props.boardWidth / size;
		puzzleArr = new PuzzleArray(size, pieceWidth);

		this.state = {
      positions: puzzleArr.positionsArray(),
      originalPositions: puzzleArr.originalPositionsArray(),
			pieceClicked: undefined,
			timer: null
		};
		console.log('   constructor, timer: ' + this.timer);
		this.timer = null;
  }
 
  componentDidUpdate(prevProps, prevState) {
    console.log('componend did update');
    console.log('- gameStarted? ' + this.props.gameStarted);
    console.log('- boardWidth? ' + this.props.boardWidth);
		
    if (prevProps.boardWidth !== this.props.boardWidth) {
			const size = this.props.gameType.size;
      const pieceWidth = this.props.boardWidth / size;      
			console.log('>>> componentDidUpdate 1st time or after resize - recalculate state.positions');
			puzzleArr.setPieceSize(pieceWidth);
			if (!this.props.gameStarted) {
				console.log('SHUFFLED!!!!');
				console.log('set original positions');
				this.setState({
					originalPositions: puzzleArr.originalPositionsArray()
				});
				this.handleShuffle();
			};
      this.setState({
					positions: puzzleArr.positionsArray(),
					originalPositions: puzzleArr.originalPositionsArray()
        })
      }
  }  


	handlePieceClicked = (e) => {
    // EXAMPLE e.target.id = 'puzzle_11'
		const id = parseInt(e.target.id.substr(7));

		console.log('handle piece clicked ' + id);
		if (puzzleArr.movePiece(id)) {
			if (!this.props.gameStarted) {
				// STARTING THE GAME
				this.startTimer();
				this.props.gameStartedRef();
			}
			this.setState({
				positions: puzzleArr.positionsArray()
			});
			console.log(puzzleArr.disorderRatio());
			if (puzzleArr.disorderRatio() === 1) {
					this.stopTimer();
					alert(`WYGRAŁES, twój czas to ${this.state.timer} sekund`);
			}
		}
	};

	handleShuffle = () => {
		console.log('Handle shuffle');

		puzzleArr.shuffle();
		this.setState({
			positions: puzzleArr.positionsArray()
		});
	};

	addSecond() {
		const newTimer = this.state.timer + 1;
		this.setState({timer: newTimer})
		console.log('          - tik -' + this.state.timer);
	}

	startTimer() {
		this.setState({timer: 0});
		this.timer = setInterval(this.addSecond.bind(this), 1000);
	}

	stopTimer() {
		console.log('stop timer!');
		
		clearInterval(this.timer);

	}

	render() {
		let timer = null;
		if (this.props.gameStarted) {
			timer = <Timer timer={this.state.timer} />
		}

    const boardWidth = this.props.boardWidth;
    const pieceWidth = boardWidth / this.props.gameType.size;

		return (
			<Auxi>
				<PuzzleBoard
          width={boardWidth} 
          pieceWidth={pieceWidth}
          onPieceClicked={this.handlePieceClicked} 
          originalPositions={this.state.originalPositions}
          positions={this.state.positions} />
				{timer}
				<button onClick={this.handleShuffle}>SHUFFLE</button>
				<button onClick={this.stopTimer.bind(this)}>Wyzeruj timer</button>
			</Auxi>
		);
	}
}

export default GamePanel;
