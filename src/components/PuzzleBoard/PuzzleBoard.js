import React from 'react';
import PuzzlePiece from './PuzzlePiece/PuzzlePiece';
import classes from './PuzzleBoard.module.css';
import image420 from '../../assets/images/420Koalas.jpg';

class PuzzleBoard extends React.Component {

    render () {

        const styleSize = {
            width: this.props.width + 'px',
            height: this.props.width + 'px',
        }

        const positions = this.props.positions;

        const puzzlePieces = positions.map( (position, index) => {
                return <PuzzlePiece 
                    key={index}
                    id={index}
                    width={this.props.pieceWidth}
                    boardWidth={this.props.width}
                    withNumber={this.props.withNumbers}
                    onPieceClicked={this.props.onPieceClicked}
                    originalPosition={this.props.originalPositions[index]}
                    position={positions[index]}
                />
        }); 
        puzzlePieces.splice(0,1); // REMOVE 1ST ELEMENT (WHICH IS NULL)



        return (
            <div className={classes.PuzzleBoard} style={styleSize}>
                <img src={image420} style={{width: this.props.width, height: this.props.width, opacity: '0.25'}} alt="background" />
                {puzzlePieces}
            </div>
        )
    }
}

export default PuzzleBoard;