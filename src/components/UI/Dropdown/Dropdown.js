import React from 'react';
import './Dropdown.css';

const Dropdown = (props) => {
	let style = "Dropdown-content";

	return (
		<div className="Dropdown">
			<div className="Dropdown-button">{ props.caption }</div>
			<ul className={style}>
        {props.children}
			</ul>
		</div>
	);
};

export default Dropdown;
