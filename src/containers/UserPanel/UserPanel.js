import React from 'react';

import './UserPanel.css';

import Auxi from '../../hoc/Auxi/Auxi';
import GameInfo from '../../components/UserPanel/GameInfo/GameInfo';
import Button from '../../components/UI/Button/Button';

import LangContext from '../../hoc/context/LangContext';
import { txt } from '../../shared/dict';

class UserPanel extends React.Component {
  state = {
    selectedGame: null,
  }  
  static contextType = LangContext;

  listClickedHandler = (game) => {
    this.setState({selectedGame: game})
  }

	render() {
    const games = this.props.availableGames.map( (game) => {
      const selected = this.state.selectedGame === game;
      const gameLabel = game.endsWith('+') ? game.slice(0, game.length - 1) + txt.WITH_NUMBERS[this.context.lang] : game;
      return (
        <li 
          className="stdBlock" 
          key={game} 
          onClick={() => this.listClickedHandler(game)}
        >
          <GameInfo 
            gameLabel={gameLabel} 
            personalBest={this.props.user.personalBests[game]} 
            highscore={this.props.highscores ? this.props.highscores[game][0].score : null}
            selected={selected}/>
        </li>
      )
    });
    
    const buttonPlayDisable = this.state.selectedGame == null;

		return (
			<Auxi>
        <div className="GamesList">
          <br/><p>{txt.SELECT_GAME_AND_PLAY[this.context.lang]}</p><br/>
          <ul>
            <li className="stdBlockStrong" key="game_list_header">
              <GameInfo 
                header={true}
                gameLabel={txt.GAME_TYPE[this.context.lang]} 
                personalBest={txt.PERSONAL_BEST[this.context.lang]} 
                highscore={txt.HIGHSCORE[this.context.lang]}/>
            </li>
            {games}
          </ul>
        </div> 
        <Button 
          disabled={buttonPlayDisable}
          callClick={() => this.props.clickPlay(this.state.selectedGame)}
        >{txt.PLAY[this.context.lang]}
        </Button>
        <Button 
          callClick={this.props.callOpenHighscores}
        >{txt.HIGHSCORES[this.context.lang]}
        </Button>        
			</Auxi>
		);
	}
}

export default UserPanel;
