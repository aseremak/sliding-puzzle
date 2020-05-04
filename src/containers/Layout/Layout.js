import React from 'react';
import './Layout.css';
// import Auxi from '../../hoc/Auxi/Auxi';

class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.state = { width: null };
		this.DBG = true;
	}

	updateWidth() {
		// const curWidth = this.myElement.clientWidth;
		const curWidth = this.myElement.parentNode.parentNode.parentNode.clientWidth; // BODY WIDTH
		
    this.DBG && console.log('[Laoyut.js updateWidth] clientWidth: ', curWidth);
		if (this.state.width !== curWidth) {
			this.setState({ width: curWidth });
      this.props.widthRef(curWidth);
    };
	}

	componentDidMount() {
    if(!this.state.width) {
      this.updateWidth();
      // console.log('state.width = ' + this.state.width);
    };
		// console.log('componentDidMount');
		window.addEventListener('resize', () => this.updateWidth());
	}

	componentWillUnmount() {
		// console.log('ComponentWillUnmount');
		window.removeEventListener('resize', () => this.updateWidth());
	}

	render() {
		return (
			<div
				className="Layout"
				ref={ (element) => {this.myElement = element} }
			>
				<h1>HEADER (width={this.state.width})</h1>
				{this.props.children}
			</div>
		);
	}
}

export default Layout;
