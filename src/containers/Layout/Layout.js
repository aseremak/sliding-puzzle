import React from 'react';
import { connect } from 'react-redux';

import './Layout.css';
import * as actions from '../../store/actions';

import LanguageSelector from '../../components/Layout/LanguageSelector/LanguageSelector';
import Settings from '../../components/Layout/Settings/Settings';
import LocalStorageWarning from '../../components/Layout/LocalStorageWarning/LocalStorageWarning';
import Modal from '../../components/UI/Modal/Modal';
import Auth from '../Auth/Auth';
import ChangeUsernameDialog from '../../components/Layout/Settings/ChangeUsernameDialog/ChangeUsernameDialog'

class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width: null,
			settingsExpanded: false,
			langSelectorExpanded: false,
			showModal: false,
			showChangeUsernameDialog: false
			// showAuth: false
			// modalChildren: null,
			// lang: 'en'
		};
		this.DBG = false;
	}

	updateWidth = () => {
		// const curWidth = this.myElement.clientWidth;
		const curWidth = this.myElement.parentNode.parentNode.parentNode.clientWidth; // BODY WIDTH

		this.DBG && console.log('[Laoyut.js updateWidth] clientWidth: ', curWidth);
		if (this.state.width !== curWidth) {
			this.setState({ width: curWidth });
			this.props.widthRef(curWidth);
		}
	};

	componentDidMount() {
		if (!this.state.width) {
			this.updateWidth();
			// console.log('state.width = ' + this.state.width);
		}
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
		});
	};

	settingsClickHandler = () => {
		console.log('settingsClickHandler');
		this.setState({
			settingsExpanded: true,
			showModal: true
		});
	};

	onClickAnywhereHandler = () => {
		console.log('Layout onClickAnywhereHandler');
		this.setState({
			langSelectorExpanded: false,
			settingsExpanded: false,
			showModal: false
		});
	};

	onLoginOrSigninClickHandler = (event) => {
		console.log('onLoginOrSigninClickHandler');
		// event.preventDefault();
		event.stopPropagation();
		// this.setState({showAuth: true})
		if (this.props.isLoggedIn) {
			this.props.callAuthLogout();
		} else {
			this.props.callAuthShowWindow();
		}
	};

	onAuthCancelClickedHandler = (event) => {
		console.log('onAuthCancelClickedHandler');
		event.stopPropagation();
		this.props.callAuthCloseWindow();
	};

	onDialogCancelClickedHandler = (event) => {
		console.log('onAuthCancelClickedHandler');
		event.stopPropagation();
		this.setState({showChangeUsernameDialog: false})
	};

	onChangeUsernameHandler = () => {
		console.log('ChangeUsernameHandler');
		this.setState({showChangeUsernameDialog: true})
	}

	render() {
		const auth = this.props.showAuth ? <Auth clickCancelCall={this.onAuthCancelClickedHandler} /> : null;

		const changeUsernameDialog = this.state.showChangeUsernameDialog
			? <ChangeUsernameDialog clickCancelCall={this.onDialogCancelClickedHandler}/>
			: null; 

		let modal = false;
		if (this.state.showModal) {
			modal = <Modal clickCall={this.onClickAnywhereHandler} />;
		}

		return (
			<div
				className="Layout"
				ref={(element) => {
					this.myElement = element;
				}}
				onClick={this.onClickAnywhereHandler}>
				<div className="Header stdBlockStrong">
					<div className="Username">
						<span>{this.props.user.username}</span>
						<button 
							className={this.props.isLoggedIn ? null : "Stress"}
							onClick={this.onLoginOrSigninClickHandler}>
							{this.props.isLoggedIn ? 'Log Out' : 'Log In'}
						</button>
					</div>
					<Settings
						isLoggedIn={this.props.isLoggedIn}
						expanded={this.state.settingsExpanded}
						clickCall={() => this.settingsClickHandler()}
						showChangeUsernameDialog={() => this.onChangeUsernameHandler()}
					/>
					<LanguageSelector
						expanded={this.state.langSelectorExpanded}
						clickCall={() => this.langSelectorClickHandler()}
						langSelect={this.props.langSelect}
					/>
				</div>
				{this.props.children}
				<LocalStorageWarning storage={this.props.storage} anonymous={this.props.anonymous} />
				{modal}
				{auth}
				{changeUsernameDialog}				
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		showAuth: state.authenticating,
		user: state.user,
		isLoggedIn: state.isLoggedIn
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		callAuthShowWindow: () => dispatch(actions.auth_open_window()),
		callAuthCloseWindow: () => dispatch(actions.auth_close_window()),
		callAuthLogout: () => dispatch(actions.auth_logout())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
