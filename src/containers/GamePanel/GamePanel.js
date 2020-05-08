import React from 'react';
import PuzzleArray from '../../PuzzleArray';
import PuzzleBoard from '../../components/PuzzleBoard/PuzzleBoard';
import Auxi from '../../hoc/Auxi/Auxi';
import Timer from '../../components/Timer/Timer';
import ImagePreview from '../../components/ImagePreview/ImagePreview';
import BestScores from '../../components/BestScores/BestScores';
import YouWin from '../../components/YouWin/YouWin';
import './GamePanel.css';
import localization from '../../localization';
import LangContext from '../../hoc/context/LangContext';


let puzzleArr = [];

const txt = new localization();

class GamePanel extends React.Component {
	constructor(props) {
		super(props);

		this.DBG = true;

		const size = this.props.game.size;
		const pieceWidth = this.props.boardWidth / size;
		puzzleArr = new PuzzleArray(size, pieceWidth);

		this.state = {
			positions: puzzleArr.positionsArray(),
			originalPositions: puzzleArr.originalPositionsArray(),
			pieceClicked: undefined,
			timer: 0,
			win: false,
			newPersonalBest: false,
			newHighscore: false,
		};

		this.DBG && console.log('[GamePanel.constructor] timer: ' + this.timer);
		this.timer = null;
	}

  static contextType = LangContext;

	componentDidMount() {
		this.DBG && console.log('[GamePanel.componentDidMount]');
		this.DBG && console.log('   - boardWidth? ' + this.props.boardWidth);

		const size = this.props.game.size;
		const pieceWidth = this.props.boardWidth / size;
		puzzleArr.setPieceSize(pieceWidth);
		this.setState({
			originalPositions: puzzleArr.originalPositionsArray()
		});
		this.handleShuffle();
	}

	handleShuffle = () => {
		this.DBG && console.log('[GamePanel.handleShuffle] Handle shuffle');

		puzzleArr.shuffle();
		this.setState({
			positions: puzzleArr.positionsArray(),
			// originalPositions: puzzleArr.originalPositionsArray()
		});
	};	

	componentDidUpdate(prevProps, prevState) {
		this.DBG && console.log('[GamePanel.componentDidUpdate]');
		this.DBG && console.log('   - gameStarted? ' + this.props.gameStarted);
		this.DBG && console.log('   - boardWidth? ' + this.props.boardWidth);

		if (prevProps.boardWidth !== this.props.boardWidth) {
			const size = this.props.game.size;
			const pieceWidth = this.props.boardWidth / size;
			puzzleArr.setPieceSize(pieceWidth);
			// this.DBG &&
			// 	console.log('[GamePanel.componentDidUpdate] 1st time or after resize - recalculate state.positions');
			this.DBG &&
				console.log('[GamePanel.componentDidUpdate] calculate positions array + set original positions');
			this.setState({
				positions: puzzleArr.positionsArray(),
				originalPositions: puzzleArr.originalPositionsArray()
			});
		}
	}

	handlePieceClicked = (e) => {
		// EXAMPLE e.target.id = 'puzzle_11'
		const id = parseInt(e.target.id.substr(7));

		this.DBG && console.log('[GamePanel.handlePieceClicked] handle piece clicked ' + id);
		if (puzzleArr.movePiece(id)) {
			if (!this.props.gameStarted) {
				// STARTING THE GAME
				this.startTimer();
				this.props.gameStartedRef();
			}
			this.setState({
				positions: puzzleArr.positionsArray()
			});
			this.DBG && console.log(puzzleArr.disorderRatio());
			if (puzzleArr.disorderRatio() === 1) { // >= 0.6
				this.stopTimer();
				this.checkNewPersonalBestOrHighscore(this.state.timer);
				this.setState({ win: true });
			}
		}
	};

	checkNewPersonalBestOrHighscore = (time) => {
		this.DBG && console.log('[GamePanel.js] checkNewPersonalBestOrHighscore');
		
		this.DBG && console.log('highscore:' + this.props.bestScores.highscore + '  personalBest:' + this.props.bestScores.personalBest);
		const highscore = this.props.bestScores.highscore || Infinity;
		const personalBest = this.props.bestScores.personalBest || Infinity;
		this.DBG && console.log('highscore2:' + highscore + '  personalBest2:' + personalBest);
		if (time < highscore) {
			this.setState({newHighscore: true})
		};
		if (time < personalBest) {
			this.setState({newPersonalBest: true})
			this.props.callUserBrokePersonalBest(this.props.game.type, time);
		};
	}

	handleResign = () => {
		this.DBG && console.log('[GamePanel.handleResign]');
		this.stopTimer();
		this.props.endGameRef();
	};

	addSecond() {
		const newTimer = this.state.timer + 1;
		this.setState({ timer: newTimer });
		this.DBG && console.log('[GamePanel.addSecond]           - tik -' + this.state.timer);
	}

	startTimer() {
		this.setState({ timer: 0 });
		this.timer = setInterval(this.addSecond.bind(this), 1000);
	}

	stopTimer() {
		this.DBG && console.log('[GamePanel.stopTimer] stop timer!');
		clearInterval(this.timer);
	}

	render() {
		this.DBG && console.log('[GamePanel.render]');
		const boardWidth = this.props.boardWidth;
		const pieceWidth = boardWidth / this.props.game.size;

		const youWin = this.state.win ? 
			<YouWin 
				time={this.state.timer}
				storage={this.props.storage}
				anonymous={this.props.anonymous}
				newPersonalBest={this.state.newPersonalBest}
				newHighscore={this.state.newHighscore}
				clickOkButton={this.props.endGameRef} /> 
			: null;

		return (
			<Auxi>
				<BestScores bestScores={this.props.bestScores} />
				<Timer timer={this.state.timer} />
				<div className="BoardsContainer">
					<PuzzleBoard
						width={boardWidth}
						pieceWidth={pieceWidth}
						withNumbers={this.props.game.withNumbers}
						onPieceClicked={this.handlePieceClicked}
						originalPositions={this.state.originalPositions}
						positions={this.state.positions}
					/>
					<ImagePreview width={boardWidth} />
				</div>
				{youWin}
				<button onClick={this.handleShuffle}>{txt.SHUFFLE_AGAIN[this.context.lang]}</button>
				<button onClick={this.handleResign}>{txt.RESIGN[this.context.lang]}</button>
			</Auxi>
		);
	}
}

export default GamePanel;
