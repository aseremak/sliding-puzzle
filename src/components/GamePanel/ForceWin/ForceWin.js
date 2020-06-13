import React from 'react';
import Button from '../../UI/Button/Button';
// import './ForceWin.css';

class ForceWin extends React.Component {
  state = {
    disabled: true
  }

  onClickButtonHandler = (event) => {
    event.preventDefault();
    this.props.callClick(this.inputElement.value)
  }

  onChangeInputHandler = () => {
    this.setState({disabled: this.inputElement.value.length === 0})
  }

  render () {
    return (
      <form className="stdBlock">
        <label>Time:</label>
        <input 
          ref={ (inputEl) => {this.inputElement = inputEl}}  // CREATE REF TO INPUT ELEMENT
          onChange={this.onChangeInputHandler}
        />
        <Button disabled={this.state.disabled} callClick={this.onClickButtonHandler}>Force Win</Button>
      </form>
    )
  }
};

export default ForceWin;