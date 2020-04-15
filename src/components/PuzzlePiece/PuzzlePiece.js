import React from 'react';
import './PuzzlePiece.css'

const puzzlePiece = (props) => {
    const style = {
        left: props.position.left + 'px',
        top: props.position.top + 'px'
    }
    return (
        <div
            className="PuzzlePiece"
            onClick={props.onPieceClicked}
            id={props.id}
            style={style}>{props.id}
        </div>
    )
}

export default puzzlePiece;