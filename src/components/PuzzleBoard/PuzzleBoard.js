import React from 'react';
import PuzzlePiece from './PuzzlePiece/PuzzlePiece';
import classes from './PuzzleBoard.module.css';

class PuzzleBoard extends React.Component {

    render () {

        const styleSize = {
            width: this.props.width + 'px',
            height: this.props.width + 'px'
        }

        const positions = this.props.positions;

        const puzzlePieces = positions.map( (position, index) => {
                return <PuzzlePiece 
                    key={index}
                    id={index}
                    width={this.props.pieceWidth}
                    boardWidth={this.props.width}
                    onPieceClicked={this.props.onPieceClicked}
                    originalPosition={this.props.originalPositions[index]}
                    position={positions[index]}
                />
        }); 
        puzzlePieces.splice(0,1); // REMOVE 1ST ELEMENT (WHICH IS NULL)



        return (
            <div className={classes.PuzzleBoard} style={styleSize}>
                {puzzlePieces}
            </div>
        )
    }
}

export default PuzzleBoard;