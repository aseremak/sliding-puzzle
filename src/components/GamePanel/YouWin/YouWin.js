import React from 'react';
import './YouWin.css';
import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';

const youWin = (props) => {
  
  let infoPersonalBest = [];
  if (props.newPersonalBest) {
    if (props.anonymous && !props.storage) {
      infoPersonalBest.push(<p key="p1">Web Storage Disabled. Unable to store your score.</p>)
    } else {
      infoPersonalBest.push(<p key="p2">This is your new Personal Best!</p>)
    }
  };

  let infoHighscore = null;

  if (props.newHighscore === null) { // waiting for the end of checking highscores
    infoHighscore = (
      <>
        <p style={{fontSize: '0.7em'}}>Your score is being compared with The High Score Table...</p>
        <Spinner vMargin="1%" />
      </>);
  }
  else if (props.newHighscore) {
    infoHighscore = [];
    if (props.newHighscore.rank === 0) {
      infoHighscore.push( props.anonymous ? <p key="p3">Your score is better than High Score!</p> : <p key="p4">You've just set a New High Score!!!</p>)
    } else {
      infoHighscore.push(<p key="p5">Your score is {props.newHighscore.rank + 1} in The High Scores Table.</p>);
    }
    if (props.anonymous) {
      infoHighscore.push(<p style={{fontSize: '0.7em'}} key="p6">(Your score won't be saved into The High Scores Table because you're not logged in)</p>)
    }
  };

  if (props.loadingHighscoresError) {
    infoHighscore = <p style={{fontSize: '0.7em'}}>An unknown error occured during comparing your score with High Scores.</p>
  }

  return (
    <div className="YouWin">
      <h2 className="stdBlockStrong">CONGRATULATIONS!</h2><br/>
      <p>Your score: <span>{props.time}</span></p><br/>
      {infoPersonalBest}<br/>
      {infoHighscore}<br/>
      <Button 
          callClick={props.clickOkButton}
        >OK
      </Button>	 
    </div>
  )
};

export default youWin;