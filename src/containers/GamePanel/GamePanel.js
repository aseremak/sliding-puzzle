import React from 'react';
import PuzzleArray from '../../PuzzleArray';
import PuzzleBoard from '../../components/PuzzleBoard/PuzzleBoard';
import Auxi from '../../hoc/Auxi/Auxi';
import Timer from '../../components/Timer/Timer';
import ImagePreview from '../../components/ImagePreview/ImagePreview';
import './GamePanel.css';

let puzzleArr = [];

class GamePanel extends React.Component {
	constructor(props) {
		super(props);
    const size = this.props.gameType.size;
    const pieceWidth = this.props.boardWidth / size;
		puzzleArr = new PuzzleArray(size, pieceWidth);
		this.DBG = puzzleArr.DBG;

		this.state = {
      positions: puzzleArr.positionsArray(),
      originalPositions: puzzleArr.originalPositionsArray(),
			pieceClicked: undefined,
			timer: 0,
			win: false
		};
		this.DBG && console.log('[GamePanel.constructor] timer: ' + this.timer);
		this.timer = null;
  }
 
  componentDidUpdate(prevProps, prevState) {
    this.DBG && console.log('[GamePanel.componentDidUpdate]');
    this.DBG && console.log('   - gameStarted? ' + this.props.gameStarted);
    this.DBG && console.log('   - boardWidth? ' + this.props.boardWidth);
		
    if (prevProps.boardWidth !== this.props.boardWidth) {
			const size = this.props.gameType.size;
      const pieceWidth = this.props.boardWidth / size;      
			this.DBG && console.log('[GamePanel.componentDidUpdate] 1st time or after resize - recalculate state.positions');
			puzzleArr.setPieceSize(pieceWidth);
			if (!this.props.gameStarted) {
				this.DBG && console.log('[GamePanel.componentDidUpdate] shuffled + set original positions'); 
				this.setState({
					originalPositions: puzzleArr.originalPositionsArray()
				});
				this.handleShuffle();
			};
			this.DBG && console.log('[GamePanel.componentDidUpdate] calculate positions array + set original positions'); 
      this.setState({
					positions: puzzleArr.positionsArray(),
					originalPositions: puzzleArr.originalPositionsArray()
        })
      }
  }  


	handlePieceClicked = (e) => {
    // EXAMPLE e.target.id = 'puzzle_11'
		const id = parseInt(e.target.id.substr(7));

		this.DBG && this.DBG && console.log('[GamePanel.handlePieceClicked] handle piece clicked ' + id); 
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
					this.setState({win: true});
			}
		}
	};

	handleShuffle = () => {
		this.DBG && console.log('[GamePanel.handleShuffle] Handle shuffle');

		puzzleArr.shuffle();
		this.setState({
			positions: puzzleArr.positionsArray()
		});
	};

	addSecond() {
		const newTimer = this.state.timer + 1;
		this.setState({timer: newTimer})
		this.DBG && console.log('[GamePanel.addSecond]           - tik -' + this.state.timer);
	}

	startTimer() {
		this.setState({timer: 0});
		this.timer = setInterval(this.addSecond.bind(this), 1000);
	}

	stopTimer() {
		this.DBG && console.log('[GamePanel.stopTimer] stop timer!');
		clearInterval(this.timer);
	}

	render() {
		this.DBG && console.log('[GamePanel.render]');
    const boardWidth = this.props.boardWidth;
		const pieceWidth = boardWidth / this.props.gameType.size;
		
		const announceWin = this.state.win ? <h1>WYGRAŁEŚ!!!</h1> : null

		return (
			<Auxi>
				<Timer timer={this.state.timer} />
				<div className="BoardsContainer">
				<PuzzleBoard
          width={boardWidth} 
          pieceWidth={pieceWidth}
          onPieceClicked={this.handlePieceClicked} 
          originalPositions={this.state.originalPositions}
          positions={this.state.positions} />
				<ImagePreview width={boardWidth} />
				</div>
				{announceWin}
				<button onClick={this.handleShuffle}>SHUFFLE</button>
			</Auxi>
		);
	}
}

export default GamePanel;
