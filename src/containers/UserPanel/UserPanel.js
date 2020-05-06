import React from 'react';
import Auxi from '../../hoc/Auxi/Auxi';
import './UserPanel.css';
import GameInfo from '../../components/GameInfo/GameInfo';
import localization from '../../localization';
import LangContext from '../../hoc/context/LangContext';

const txt = new localization();

class UserPanel extends React.Component {
	constructor(props) {
    super(props);
    this.DBG = true;

    this.DBG && console.log('[UserPanel.js] constructor');
    console.log(this.props.user);

    this.state = {
      selectedGame: null,
    }

    // this.readStorageData();
  }

  // readStorageData() {
  //   this.DBG && console.log('[UserPanel.js] readStorageData');
  //   localStorage.setItem('3x3', 135);
  //   console.log(localStorage.getItem('3x3'));
  // }

  static contextType = LangContext;

  listClickedHandler = (game) => {
    this.setState({selectedGame: game})
  }

	render() {
    this.DBG && console.log('[UserPanel.render]');
    const games = this.props.availableGames;
    const allGames = games.concat(games.map( (game) => game + '+' )).map( (game) => {
      const selected = this.state.selectedGame === game;
      const gameLabel = game.endsWith('+') ? game.slice(0, game.length - 1) + txt.WITH_NUMBERS[this.context.lang] : game;
      return (
        <li 
          key={game} 
          onClick={() => this.listClickedHandler(game)}
        >
          <GameInfo 
            gameLabel={gameLabel} 
            personalBest={this.props.user.personalBests[game]} 
            highscore={'-'}
            selected={selected}/>
        </li>
      )
    });
    
    const buttonPlayDisable = this.state.selectedGame == null;

		return (
			<Auxi>
        <div className="GamesList">
          <p>{txt.SELECT_GAME_AND_CLICK_PLAY[this.context.lang]}</p>
          <ul>
            <li key="game_list_header">
              <GameInfo 
                gameLabel="game" 
                personalBest="personal best" 
                averagePB="avg. personal best" 
                highscore="high score"/>
            </li>
            {allGames}
          </ul>
        </div> 
        <button 
          disabled={buttonPlayDisable}
          onClick={() => this.props.clickPlay(this.state.selectedGame)}
        >{txt.PLAY[this.context.lang]}
        </button>
			</Auxi>
		);
	}
}

export default UserPanel;
