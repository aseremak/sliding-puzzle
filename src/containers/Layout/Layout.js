import React from 'react';
import './Layout.css';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import LocalStorageWarning from '../../components/LocalStorageWarning/LocalStorageWarning';

class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			width: null,
			// lang: 'en'
		};
		this.DBG = false;
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
				<div className="Header">
					<div className="Username">{this.props.username}</div>
					<LanguageSelector langSelect={this.props.langSelect} />
				</div>
				{this.props.children}
				<LocalStorageWarning 
					storage={this.props.storage}
					anonymous={this.props.anonymous}
				/>
			</div>
		);
	}
}

export default Layout;
