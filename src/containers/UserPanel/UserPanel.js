import React from 'react';
import Auxi from '../../hoc/Auxi/Auxi';
import './UserPanel.css';
import GameInfo from '../../components/GameInfo/GameInfo';

const WITH_NUMBERS = {
  'en': ' with numbers',
  'pl': ' z numerami',
},
  LAN = 'pl';

class UserPanel extends React.Component {
	constructor(props) {
    super(props);
    this.DBG = true;

    this.state = {
      selectedGame: null,
    }
  }

  listClickedHandler = (game) => {
    this.setState({selectedGame: game})
  }

	render() {
    this.DBG && console.log('[UserPanel.render]');
    const games = this.props.availableGames;
    const allGames = games.concat(games.map( (game) => game + '+' )).map( (game) => {
      const selected = this.state.selectedGame === game;
      const gameLabel = game.endsWith('+') ? game.slice(0, game.length - 1) + WITH_NUMBERS[LAN] : game;
      return (
        <li 
          key={game} 
          onClick={() => this.listClickedHandler(game)}
        >
          <GameInfo gameLabel={gameLabel} selected={selected}/>
        </li>
      )
    });
    
    const buttonPlayDisable = this.state.selectedGame == null;

		return (
			<Auxi>
        <div className="GamesList">
          <p>Wybierz rodzaj gry i naciśnij ZAGRAJ</p>
          <ul>
            {allGames}
          </ul>
        </div> 
        <button 
          disabled={buttonPlayDisable}
          onClick={() => this.props.clickPlay(this.state.selectedGame)}
        >ZAGRAJ
        </button>
			</Auxi>
		);
	}
}

export default UserPanel;
