import React from 'react';
import './Dropdown.css';

class Dropdown extends React.Component {

	// state={
	// 	showList: false
	// }

	render () {
		let style = 'Dropdown-content';
		if (this.props.expanded) {
			style += ' Dropdown-content-show';
		};
		// if(this.state.showList) {
		// 	style += ' Dropdown-content-show';
		// }

		return (
			<div className="Dropdown">
				<div 
					className="Dropdown-button"
					onClick={ (e) => {this.props.clickCall(); e.stopPropagation()}}
					>{ this.props.caption }</div>
				<ul className={style}>
					{this.props.children}
				</ul>
			</div>
		);
	}
};

export default Dropdown;
