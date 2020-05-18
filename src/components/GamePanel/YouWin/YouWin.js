import React from 'react';
import './YouWin.css';
import Button from '../../UI/Button/Button';

const youWin = (props) => {
  console.log('[YouWin.js] anonymous, storage:', props.anonymous, props.storage);
  
  let info = [];
  if (props.newPersonalBest) {
    // if (props.anonymous) {
    //   if(props.storage) {
    //     info.push(<p>This is your new Personal Best!</p>)
    //   } else {
    //     info.push(<p>Web Storage Disabled. Unable to store your score.</p>)
    //   }
    // } else {
    //   info.push(<p>This is your new Personal Best!</p>)
    // }
    if (props.anonymous && !props.storage) {
      info.push(<p key="p1">Web Storage Disabled. Unable to store your score.</p>)
    } else {
      info.push(<p key="p2">This is your new Personal Best!</p>)
    }
  };
  if (props.newHighscore) {
    if (props.anonymous) {
      info.push(<p key="p3">Your score is better than High Score!<br/>(but it won't be saved because you're not logged in)</p>)
    } else {
      info.push(<p key="p4">You've just set a New High Score!!!</p>)
    }
  };

  return (
    <div className="YouWin">
      <h2>CONGRATULATIONS!</h2><br/>
      <p>Your time: <span>{props.time}</span></p>
      {info}<br/>
      <Button 
          callClick={props.clickOkButton}
        >OK
      </Button>	 
      {/* <button onClick={props.clickOkButton}>OK</button> */}
    </div>
  )
};

export default youWin;