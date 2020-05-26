import React from 'react';
import Dropdown from '../../UI/Dropdown/Dropdown';
import gearIcon from '../../../assets/images/gear.png';


const settings = (props) => {
	const commands = props.isLoggedIn
		? (
			<>
			<li>Change Password</li>
			<li onClick={props.showChangeUsernameDialog}>Change User Name</li>
			</>
		) 
		: <li>Clear Personal Bests</li>

	return (
		<Dropdown 
			expanded={props.expanded}
			clickCall={props.clickCall}
			caption='Settings'
      image={gearIcon}>
			{commands}
		</Dropdown>
		)
};

export default settings;
