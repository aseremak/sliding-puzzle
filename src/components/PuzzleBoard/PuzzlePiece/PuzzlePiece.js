import React from 'react';
import './PuzzlePiece.css'
import gif1x1 from '../../../assets/images/1x1.gif';
import image240 from '../../../assets/images/240Koalas.jpg';
import image360 from '../../../assets/images/360Koalas.jpg';
import image420 from '../../../assets/images/420Koalas.jpg';

const puzzlePiece = (props) => {

    const image = {
        240: image240,
        360: image360,
        420: image420
    }

    const style = {
        width: props.width + 'px',
        height: props.width + 'px',
        background: `url(${image[props.boardWidth]}) ${-props.originalPosition.left}px ${-props.originalPosition.top}px`,
        left: props.position.left + 'px',
        top: props.position.top + 'px'
    }


    return (
        <div
            className="PuzzlePiece"
            onClick={props.onPieceClicked}
            id={'puzzle_'+props.id}
            style={style}>
                <img src={gif1x1} alt="Puzzle Piece" />
                &nbsp;{props.id}
        </div>
    )
}

export default puzzlePiece;