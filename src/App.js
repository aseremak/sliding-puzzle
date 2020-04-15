import React from 'react';
import './App.css';
import PuzzleArray from './PuzzleArray';
import PuzzleBoard from './components/PuzzleBoard/PuzzleBoard';
import puzzlePiece from './components/PuzzlePiece/PuzzlePiece';

let SIZE = 3;
let puzzleArr = new PuzzleArray(SIZE);

class App extends React.Component {
  
  state = {
    positions: puzzleArr.positionsArray(),
    pieceClicked: undefined
  }

  handlePieceClicked = (e) => {
    const id = parseInt(e.target.id);
    if (puzzleArr.movePiece(id)) {
      this.setState({
        positions: puzzleArr.positionsArray()
      });
      console.log(puzzleArr.disorderRatio());
      if(puzzleArr.disorderRatio() === 1) {
        for(let i=0; i<100; i++){
          console.log('WYGRAŁEŚ');
          console.log(' WYGRAŁEŚ');
        };
      }
    };
  };
  
  handleShuffle = () => {
    puzzleArr.shuffle();
    this.setState({
      positions: puzzleArr.positionsArray()
    });
  };

  render () {

    return (
      <div className="App">
        <PuzzleBoard onPieceClicked={this.handlePieceClicked} positions={this.state.positions} />
        <button onClick={this.handleShuffle}>SHUFFLE</button>
      </div>
    );
  }
  
}

export default App;
