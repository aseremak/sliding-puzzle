import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';
import './GamePanel.css';

import PuzzleArray from '../../PuzzleArray';
import PuzzleBoard from '../../components/GamePanel/PuzzleBoard/PuzzleBoard';
import Auxi from '../../hoc/Auxi/Auxi';
import Timer from '../../components/GamePanel/Timer/Timer';
import ImagePreview from '../../components/ImagePreview/ImagePreview';
import BestScores from '../../components/GamePanel/BestScores/BestScores';
import YouWin from '../../components/GamePanel/YouWin/YouWin';
import Button from '../../components/UI/Button/Button';
import localization from '../../localization';
import LangContext from '../../hoc/context/LangContext';

import Modal from '../../components/UI/Modal/Modal';

let puzzleArr = [];

const txt = new localization();

class GamePanel extends React.Component {
	constructor(props) {
		super(props);

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
			newHighscore: null, // object {value: number, rank: number} on null
													// for YouWin component null means that highscores are being checked
			bestScores: { ...this.props.bestScores } // save initial props.bestScores in order to push then to
			// BestScores component as constant values
		};

		this.timer = null;
	}

	static contextType = LangContext;

	componentDidMount() {
		const size = this.props.game.size;
		const pieceWidth = this.props.boardWidth / size;
		puzzleArr.setPieceSize(pieceWidth);
		this.setState({
			originalPositions: puzzleArr.originalPositionsArray()
		});
		this.handleShuffle();
	}

	handleShuffle = () => {
		puzzleArr.shuffle();
		this.setState({
			positions: puzzleArr.positionsArray()
			// originalPositions: puzzleArr.originalPositionsArray()
		});
	};

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.boardWidth !== this.props.boardWidth) {
			const size = this.props.game.size;
			const pieceWidth = this.props.boardWidth / size;
			puzzleArr.setPieceSize(pieceWidth);
			this.setState({
				positions: puzzleArr.positionsArray(),
				originalPositions: puzzleArr.originalPositionsArray()
			});
		}
	}

	handlePieceClicked = (e) => {
		// EXAMPLE e.target.id = 'puzzle_11'
		const id = parseInt(e.target.id.substr(7));

		if (puzzleArr.movePiece(id)) {
			if (!this.props.gameStarted) {
				// STARTING THE GAME
				this.startTimer();
				this.props.gameStartedRef();
			}
			this.setState({
				positions: puzzleArr.positionsArray()
			});
			if (puzzleArr.disorderRatio() === 1) {
				this.stopTimer();
				this.checkNewPersonalBest(this.state.timer);
				this.checkNewHighscore(this.state.timer);
				this.setState({ win: true });
			}
		}
	};

	checkNewPersonalBest = (time) => {
		console.log('[checkNewPersonalBest]');

		const personalBest = this.props.bestScores.personalBest || Infinity;
		if (time < personalBest) {
			this.setState({ newPersonalBest: true });
			this.props.newPersonalBest(this.props.game.type, time);

			if (this.props.anonymous) {
				// UPDATE LOCAL STORAGE SCORES
				if (this.props.storage) {
					let scores = localStorage.getItem('slidePuzzleScores');
					let updatedScores = {};
					if (scores) {
						updatedScores = JSON.parse(scores);
						console.log(updatedScores);
						updatedScores[this.props.game.type] = time;
					} else {
						updatedScores = {
							[this.props.game.type]: time
						};
					}
					localStorage.setItem('slidePuzzleScores', JSON.stringify(updatedScores));
					console.log('[GamePanel.js] personal best saved in localStorage.');
				}
			}
		}
	};

	checkNewHighscore = (time) => {
		console.log('[checkNewHighscore]');

		// this.props.compareNewHighscore(time);

		// return null;

		const highscores = this.props.highscores[this.props.game.type];

		for (let pos = 0; pos < highscores.length; pos++) {
			// console.log(`CHECKING score: ${time} < ${highscores[pos].score}, position: ${pos}`);
			if (time < highscores[pos].score) {
				// console.log(`score: ${time} < ${highscores[pos].score}, position: ${pos}`);
				this.setState({
					newHighscore: {
						value: time,
						rank: pos
					}
				});
				return null;
			}
		}
		console.log('New Highscore because of empty rank');

		if (highscores.length < 10) {
			this.setState({
				newHighscore: {
					value: time,
					rank: highscores.length
				}
			});
			console.log('new highscore at position: ' + highscores.length);
		}
	};

	handleResign = () => {
		this.stopTimer();
		this.props.endGameRef();
	};

	addSecond = () => {
		const newTimer = this.state.timer + 1;
		this.setState({ timer: newTimer });
	};

	startTimer = () => {
		this.setState({ timer: 0 });
		this.timer = setInterval(this.addSecond.bind(this), 1000);
	};

	stopTimer = () => {
		clearInterval(this.timer);
	};

	handleCompareHighscores = () => {
		this.props.compareNewHighscore(33);
	}

	render() {
		const boardWidth = this.props.boardWidth;
		const pieceWidth = boardWidth / this.props.game.size;

		const youWin = this.state.win ? (
			<Modal clickCall={this.props.endGameRef}>
				<YouWin
					time={this.state.timer}
					storage={this.props.storage}
					anonymous={this.props.anonymous}
					newPersonalBest={this.state.newPersonalBest}
					newHighscore={this.state.newHighscore}
					clickOkButton={this.props.endGameRef}
				/>
			</Modal>
		) : null;

		return (
			<Auxi>
				<BestScores bestScores={this.state.bestScores} />
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
				<Button callClick={this.handleShuffle}>{txt.SHUFFLE_AGAIN[this.context.lang]}</Button>
				<Button callClick={this.handleResign}>{txt.RESIGN[this.context.lang]}</Button>
				<Button callClick={this.handleCompareHighscores}>call compare new score</Button>
			</Auxi>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		// user: state.user,
		highscores: state.highscores
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		// getHighscores: () => dispatch(actions.highscores_get()),
		// setPersonalBests: (personalBest) => dispatch(actions.user_set_personal_bests(personalBest)),
		newPersonalBest: (gameType, time) => dispatch(actions.user_new_personal_best(gameType, time)),
		compareNewHighscore: (score) => dispatch(actions.highscores_compare_new_score(score)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GamePanel);
