import React from 'react';
import { connect } from 'react-redux';

import './Layout.css';
import * as actions from '../../store/actions';

import LangContext from '../../hoc/context/LangContext';
import { txt } from '../../shared/dict';

import LanguageSelector from '../../components/Layout/LanguageSelector/LanguageSelector';
import Settings from '../../components/Layout/Settings/Settings';
import LocalStorageWarning from '../../components/Layout/LocalStorageWarning/LocalStorageWarning';
import CookieInformation from '../../components/Layout/CookieInformation/CookieInformation';
import Modal from '../../components/UI/Modal/Modal';
import Auth from '../Auth/Auth';
import ChangeUsernameDialog from '../../components/Layout/Settings/ChangeUsernameDialog/ChangeUsernameDialog';
import ChangePasswordDialog from '../../components/Layout/Settings/ChangePasswordDialog/ChangePasswordDialog';
import ConfirmDialog from '../../components/Layout/ConfirmDialog/ConfirmDialog';

class Layout extends React.Component {
	state = {
		width: null,
		settingsExpanded: false,
		langSelectorExpanded: false,
		showModal: false,
		showChangeUsernameDialog: false,
		showChangePasswordDialog: false,
		showConfirmDialog: false,
		callAfterConfirmation: null,
		cookieInformationShown: false
	};
	static contextType = LangContext;

	updateWidth = () => {
		// const curWidth = this.myElement.clientWidth;
		const curWidth = this.myElement.parentNode.parentNode.parentNode.clientWidth; // BODY WIDTH
		if (this.state.width !== curWidth) {
			this.setState({ width: curWidth });
			this.props.widthRef(curWidth);
		}
	};

	componentDidMount() {
		if (!this.state.width) {
			this.updateWidth();
		}
		window.addEventListener('resize', () => this.updateWidth());
		try {
			const cookie = localStorage.getItem('slidePuzzleCookie');
			this.setState({cookieInformationShown: cookie === '1'})
		} catch {};
	}

	componentWillUnmount() {
		window.removeEventListener('resize', () => this.updateWidth());
	}

	langSelectorClickHandler = () => {
		this.setState({
			langSelectorExpanded: true,
			showModal: true
		});
	};

	settingsClickHandler = () => {
		this.setState({
			settingsExpanded: true,
			showModal: true
		});
	};

	onClickAnywhereHandler = () => {
		this.setState({
			langSelectorExpanded: false,
			settingsExpanded: false,
			showModal: false
		});
	};

	onLogInOutOrSignInClickHandler = (event) => {
		event.stopPropagation();
		if (this.props.activePanel === 'game') {
			this.setState({
				showConfirmDialog: true,
				callAfterConfirmation: 'auth'
			});
		} else {
			if (this.props.isLoggedIn) {
				this.props.callAuthLogout();
			} else {
				this.props.clearPersonalBestCall();
				this.props.callAuthShowWindow();
			}
		}
	};

	onClearPersonalBestsHandler = () => {
		this.setState({
			showConfirmDialog: true,
			callAfterConfirmation: 'clearPersonalBests'
		});
	};

	onConfirmYesClickHandler = (event) => {
		event.stopPropagation();
		if (this.state.callAfterConfirmation === 'auth') {
			if (this.props.isLoggedIn) {
				this.props.callAuthLogout();
			} else {
				this.props.callAuthShowWindow();
			}
		} else {
			this.props.clearPersonalBestCall();
		}

		this.setState({
			showConfirmDialog: false,
			callAfterConfirmation: null
		});
	};

	onConfirmNoClickHandler = (event) => {
		event.stopPropagation();
		this.setState({
			showConfirmDialog: false,
			callAfterConfirmation: null
		});
	};

	onAuthCancelClickedHandler = (event) => {
		event.stopPropagation();
		this.props.callAuthCloseWindow();
	};

	onDialogCancelClickedHandler = (event) => {
		event.stopPropagation();
		this.setState({
			showChangeUsernameDialog: false,
			showChangePasswordDialog: false
		});
	};

	onChangeUsernameHandler = () => {
		this.props.resetErrors();
		this.setState({ showChangeUsernameDialog: true });
	};

	onChangePasswordHandler = () => {
		this.props.resetErrors();
		this.setState({ showChangePasswordDialog: true });
	};

	onCookieDialogAccepted = () => {
		try {
			localStorage.setItem('slidePuzzleCookie', '1')
		} catch {};
		this.setState({ cookieInformationShown: true });
	}

	render() {
		const auth = this.props.showAuth ? <Auth clickCancelCall={this.onAuthCancelClickedHandler} /> : null;

		let dialog = null;
		if (this.state.showConfirmDialog) {
			dialog = (
				<ConfirmDialog
					callConfirmYes={this.onConfirmYesClickHandler}
					callConfirmNo={this.onConfirmNoClickHandler}
					message={
						this.state.callAfterConfirmation === 'auth' ? (
							txt.GAME_LL_BE_CANCELED[this.context.lang]
						) : (
							txt.SCORES_LL_BE_DELETED[this.context.lang]
						)
					}
				/>
			);
		} else if (this.state.showChangeUsernameDialog) {
			dialog = <ChangeUsernameDialog clickCancelCall={this.onDialogCancelClickedHandler} />;
		} else if (this.state.showChangePasswordDialog) {
			dialog = <ChangePasswordDialog clickCancelCall={this.onDialogCancelClickedHandler} />;
		}

		let modal = false;
		if (!this.state.cookieInformationShown) {
			modal = (
				<Modal>
					<CookieInformation clickCall={this.onCookieDialogAccepted} />
				</Modal>
			);
		} else if (this.state.showModal) {
			modal = <Modal clickCall={this.onClickAnywhereHandler} />;
		}

		const localStorageWarning = !this.props.storage && this.props.user.anonymous ? <LocalStorageWarning /> : null;

		const logInOrOut = this.props.isLoggedIn ? txt.LOGOUT[this.context.lang] : txt.LOGIN[this.context.lang];

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
							className={this.props.isLoggedIn ? null : 'Stress'}
							onClick={this.onLogInOutOrSignInClickHandler}>
							{logInOrOut}
						</button>
					</div>
					<Settings
						isLoggedIn={this.props.isLoggedIn}
						expanded={this.state.settingsExpanded}
						clickCall={() => this.settingsClickHandler()}
						showChangeUsernameDialog={() => this.onChangeUsernameHandler()}
						showChangePasswordDialog={() => this.onChangePasswordHandler()}
						clearPersonalBestCall={() => this.onClearPersonalBestsHandler()}
					/>
					<LanguageSelector
						expanded={this.state.langSelectorExpanded}
						clickCall={() => this.langSelectorClickHandler()}
						langSelect={this.props.langSelect}
					/>
				</div>
				{this.props.children}
				{localStorageWarning}
				{modal}
				{auth}
				{dialog}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		showAuth: state.authenticating,
		user: state.user,
		isLoggedIn: state.isLoggedIn,
		activePanel: state.activePanel
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		callAuthShowWindow: () => dispatch(actions.authOpenWindow()),
		callAuthCloseWindow: () => dispatch(actions.authCloseWindow()),
		callAuthLogout: () => dispatch(actions.authLogout()),
		resetErrors: () => dispatch(actions.resetErrors())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
