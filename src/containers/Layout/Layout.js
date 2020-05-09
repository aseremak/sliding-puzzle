import React from 'react';
import './Layout.css';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import LocalStorageWarning from '../../components/LocalStorageWarning/LocalStorageWarning';
import Modal from '../../components/UI/Modal/Modal';

class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			width: null,
			langSelectorExpanded: false,
			showModal: false,
			// modalChildren: null,
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

	langSelectorClickHandler = () => {
		console.log('langSelectorClickHandler');
		this.setState({
			langSelectorExpanded: true,
			showModal: true
		})
	}

	onClickHandler = () => {
		console.log('Layout onClickHandler')
		this.setState({
			langSelectorExpanded: false,
			showModal: false		
		})
	}

	render() {
		let modal=false;
		if (this.state.showModal) {
			modal=<Modal clickCall={() => this.onClickHandler()}></Modal>
		}
		return (
			<div
				className="Layout"
				ref={ (element) => {this.myElement = element} }
				onClick={ () => {this.onClickHandler()}}
			>
				<div className="Header">
					<div className="Username">{this.props.username}</div>
					<LanguageSelector
						expanded={this.state.langSelectorExpanded}
						clickCall={() => this.langSelectorClickHandler()}
						langSelect={this.props.langSelect} />
				</div>
				{this.props.children}
				<LocalStorageWarning 
					storage={this.props.storage}
					anonymous={this.props.anonymous}
				/>
				{modal}
			</div>
			
		);
	}
}

export default Layout;
