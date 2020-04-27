import React from 'react';
import PuzzleArray from '../../PuzzleArray';
import PuzzleBoard from '../../components/PuzzleBoard/PuzzleBoard';
// import puzzlePiece from './components/PuzzlePiece/PuzzlePiece';
import Auxi from '../../hoc/Auxi/Auxi';

// let SIZE = 3;
let puzzleArr = [];

class GamePanel extends React.Component {
	constructor(props) {
		super(props);
    const size = this.props.settings.gameType.size;
    const pieceWidth = this.props.settings.boardWidth / size;
		puzzleArr = new PuzzleArray(size, pieceWidth);

		this.state = {
      positions: puzzleArr.positionsArray(),
      originalPositions: puzzleArr.originalPositionsArray(),
			pieceClicked: undefined
		};
		console.log(this.props.settings.boardWidth);
  }
 
  componentDidUpdate(prevProps, prevState) {
    
    console.log(prevProps.settings.boardWidth, this.props.settings.boardWidth);
    if (prevProps.settings.boardWidth !== this.props.settings.boardWidth) {
      console.log('    COMPONENT DID UPDATE - CHANGE SIZE');
      const size = this.props.settings.gameType.size;
      console.log('    ----> size: ' + size);
      
      const pieceWidth = this.props.settings.boardWidth / size;      
      puzzleArr.setPieceSize(pieceWidth);
      this.setState({
          positions: puzzleArr.positionsArray(),
          originalPositions: puzzleArr.originalPositionsArray(),
          pieceClicked: undefined
        })
      }
  }  

	handlePieceClicked = (e) => {
    // ex: e.target.id = 'puzzle_11'
		const id = parseInt(e.target.id.substr(7));

		console.log('handle piece clicked ' + id);
		if (puzzleArr.movePiece(id)) {
			this.setState({
				positions: puzzleArr.positionsArray()
			});
			console.log(puzzleArr.disorderRatio());
			if (puzzleArr.disorderRatio() === 1) {
				for (let i = 0; i < 100; i++) {
					console.log('WYGRAŁEŚ');
					console.log(' WYGRAŁEŚ');
				}
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

	render() {
		let info = null;
		if (!this.props.settings.gameStarted) {


			console.log('RENDER ' + this.props.settings.boardWidth);

			info = <p>CZEKAMY NA KLIKNIECIE</p>;
		}

    const boardWidth = this.props.settings.boardWidth;
    const pieceWidth = boardWidth / this.props.settings.gameType.size;

		return (
			<Auxi>
				<PuzzleBoard
          width={boardWidth} 
          pieceWidth={pieceWidth}
          onPieceClicked={this.handlePieceClicked} 
          originalPositions={this.state.originalPositions}
          positions={this.state.positions} />
				<br />
				<p>{this.props.settings.boardWidth}</p>
				{info}
				<br />
				<button onClick={this.handleShuffle}>SHUFFLE</button>
			</Auxi>
		);
	}
}

export default GamePanel;
