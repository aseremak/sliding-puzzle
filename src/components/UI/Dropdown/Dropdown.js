import React from 'react';
import './Dropdown.css';

class Dropdown extends React.Component {

	render() {
		let style = 'Dropdown-content stdBlock';
		if (this.props.expanded) {
			style += ' Dropdown-content-show';
		}

		const iconOrCaption = this.props.image ? <img src={this.props.image} alt={this.props.caption} /> : this.props.caption;

		return (
			<div className="Dropdown">
				<div
					className="Dropdown-button"
					onClick={(e) => {
						this.props.clickCall();
						e.stopPropagation();
					}}>
					{iconOrCaption}
				</div>
				<ul className={style}>{this.props.children}</ul>
			</div>
		);
	}
}

export default Dropdown;
