import React, { Component } from 'react';
import Dropdown from '../../UI/Dropdown/Dropdown';
import gearIcon from '../../../assets/images/gear.png';

import LangContext from '../../../hoc/context/LangContext';
import { txt } from '../../../shared/dict';

class Settings extends Component {
	
	static contextType = LangContext;

	render() {
		const commands = this.props.isLoggedIn
		? (
			<>
			<li onClick={this.props.showChangePasswordDialog}>{txt.CHANGE_PASSWORD[this.context.lang]}</li>
			<li onClick={this.props.showChangeUsernameDialog}>{txt.CHANGE_USERNAME[this.context.lang]}</li>
			</>
		) 
		: <li onClick={this.props.clearPersonalBestCall}>{txt.DELETE_PB[this.context.lang]}</li>

	return (
		<Dropdown 
			expanded={this.props.expanded}
			clickCall={this.props.clickCall}
			caption={txt.SETTINGS[this.context.lang]}
      image={gearIcon}>
			{commands}
		</Dropdown>
		)
	}

};

export default Settings;
