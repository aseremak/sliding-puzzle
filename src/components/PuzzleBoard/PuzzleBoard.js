import React from 'react';
import PuzzlePiece from '../PuzzlePiece/PuzzlePiece';
import './PuzzleBoard.css';

class PuzzleBoard extends React.Component {

    render () {
        const positions = this.props.positions;

        const puzzlePieces = positions.map( (position, index) => {
                return <PuzzlePiece 
                    key={index}
                    id={index}
                    onPieceClicked={this.props.onPieceClicked}
                    position={positions[index]}
                />
        }); 
        puzzlePieces.splice(0,1); // REMOVE 1ST ELEMENT (WHICH IS NULL)

        return (
            <div id="PuzzleBoard">
                {puzzlePieces}
            </div>
        )
    }
}

export default PuzzleBoard;