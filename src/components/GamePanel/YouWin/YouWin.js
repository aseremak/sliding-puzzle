import React from 'react';
import './YouWin.css';
import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';

import LangContext from '../../../hoc/context/LangContext';
import { txt } from '../../../shared/dict';



class YouWin extends React.Component {

  static contextType = LangContext;
  
  render () {
    let infoPersonalBest = [];
    if (this.props.newPersonalBest) {
      if (this.props.anonymous && !this.props.storage) {
        infoPersonalBest.push(<p key="p1" style={{fontSize: '0.7em'}}>{txt.UNABLE_STORE_PB[this.context.lang]}</p>)
      } else {
        infoPersonalBest.push(<p key="p2">{txt.NEW_PB[this.context.lang]}</p>)
      }
    };
  
    let infoHighscore = null;
  
    if (this.props.newHighscore === null) { // waiting for the end of checking highscores
      infoHighscore = (
        <>
          <p style={{fontSize: '0.7em'}}>{txt.SCORE_COMPARING[this.context.lang]}</p>
          <Spinner vMargin="1%" />
        </>);
    }
    else if (this.props.newHighscore) {
      infoHighscore = [];
      if (this.props.newHighscore.rank === 0) {
      infoHighscore.push( this.props.anonymous ? <p key="p3">{txt.SCORE_BETTER[this.context.lang]}</p> : <p key="p4">You've just set a New High Score!!!</p>)
      } else {
        infoHighscore.push(<p key="p5">{txt.SCORE_POS1[this.context.lang] + (this.props.newHighscore.rank + 1) + txt.SCORE_POS2[this.context.lang]}</p>);
      }
      if (this.props.anonymous) {
        infoHighscore.push(<p style={{fontSize: '0.7em'}} key="p6">{txt.SCORE_ANONYMOUS[this.context.lang]}</p>)
      }
    };
  
    if (this.props.loadingHighscoresError) {
      infoHighscore = <p style={{fontSize: '0.7em'}}>{txt.SCORE_ERROR[this.context.lang]}</p>
    }
  
    return (
      <div className="YouWin">
        <h2 className="stdBlockStrong">{txt.CONGRATULATIONS[this.context.lang]}</h2><br/>
        <p>{txt.YOUR_SCORE[this.context.lang]}<span>{this.props.time}</span></p><br/>
        {infoPersonalBest}<br/>
        {infoHighscore}<br/>
        <Button 
            callClick={this.props.clickOkButton}
          >{txt.OK[this.context.lang]}
        </Button>	 
      </div>
    )
  }
};

export default YouWin;