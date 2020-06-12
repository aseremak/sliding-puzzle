import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Auth.css';

import Modal from '../../components/UI/Modal/Modal';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

import { updateObject, checkValidity } from '../../shared/utility';
import * as actions from '../../store/actions';

import LangContext from '../../hoc/context/LangContext';
import { txt } from '../../shared/dict';

class Auth extends Component {

	static contextType = LangContext;

	state = {
		formIsValid: false,
		isSignup: false,
		hideErrorMessage: false,
		controls: {
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: txt.MAIL_ADDRESS[this.context.lang]
				},
				validation: {
					required: true,
					isEmail: true
				},
				valid: false,
				touched: false,
				value: ''
			},
			password: {
				elementType: 'input',
				elementConfig: {
					type: 'password',
					placeholder: txt.PASSWORD_MIN6[this.context.lang]
				},
				validation: {
					required: true,
					minLength: 6
				},
				valid: false,
				touched: false,
				value: ''
			},
			username: {
				elementType: 'input',
				elementConfig: {
					type: 'username',
					placeholder: txt.USERNAME_MIN3[this.context.lang]
				},
				validation: {
					required: true,
					minLength: 3
				},
				valid: false,
				touched: false,
				value: ''
			}
		}
	};

	inputChangedHandler = (event, controlName) => {
		const updatedControls = updateObject(this.state.controls, {
			[controlName]: updateObject(this.state.controls[controlName], {
				value: event.target.value,
				valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
				touched: true
			})
		});

		let formIsValid = true;
		for (let controlName in updatedControls) {
			if (!this.state.isSignup && controlName === 'username') {
				// USERNAME IS INVISIBLE => SKIP CHECKING
				continue;
			}
			if (updatedControls[controlName].valid !== undefined) {
				formIsValid = formIsValid && updatedControls[controlName].valid;
			}
		}
		this.setState({ controls: updatedControls, formIsValid: formIsValid });
	};

	onLoginOrSignupHandler = () => {
		this.props.onAuth(
			{
				email: this.state.controls.email.value,
				password: this.state.controls.password.value,
				username: this.state.controls.username.value
			},
			this.state.isSignup
		);
		this.setState({hideErrorMessage: false})
	};

	onSwitchToSignupClickHandler = () => {
		this.setState({ 
			isSignup: true,
			hideErrorMessage: this.props.error ? true : false
		});
	};

	render() {
		const formElementsArray = [];
		for (let key in this.state.controls) {
			if (this.state.isSignup || key !== 'username')
				formElementsArray.push({
					id: key,
					config: this.state.controls[key]
				});
		}
		let form = formElementsArray.map((el) => (
			<Input
				key={el.id}
				elementType={el.config.elementType}
				elementConfig={el.config.elementConfig}
				value={el.config.value}
				invalid={!el.config.valid}
				shouldValidate={el.config.validation}
				touched={el.config.touched}
				changed={(event) => this.inputChangedHandler(event, el.id)}
			/>
		));

		let errorMessage = null;
		if (this.props.error && !this.state.hideErrorMessage) {
			errorMessage = <p className="ErrorMessage">{this.props.error.message}</p>;
		}

		let loginBlock = null,
			signupBlock = null,
			spinner = null;
		if (this.props.loading) {
			spinner = this.props.loading ? <Spinner /> : null;
		} else {
			loginBlock = (
				<div className="Auth stdBlock">
					<p>{this.state.isSignup ?txt.SIGNUP[this.context.lang] : txt.LOGIN[this.context.lang]} {txt.USING_EMAIL_PASSWORD[this.context.lang]}</p>
					{form}
					{errorMessage}
					<Button disabled={!this.state.formIsValid} callClick={this.onLoginOrSignupHandler}>
						{this.state.isSignup ? txt.SIGNUP[this.context.lang] : txt.LOGIN[this.context.lang]}
					</Button>
				</div>
			);
			if (!this.state.isSignup) {
				signupBlock = (
					<div className="Auth stdBlock">
						<p>{txt.CREATE_ACCOUNT[this.context.lang]}</p>
						<Button callClick={this.onSwitchToSignupClickHandler}>{txt.SIGNUP[this.context.lang]}</Button>
					</div>
				);
			}
		}

		return (
			<Modal>
				<div>
					{loginBlock}
					{signupBlock}
					{spinner}
				</div>
		<Button callClick={this.props.clickCancelCall}>{txt.CANCEL[this.context.lang]}</Button>
			</Modal>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		error: state.error,
		loading: state.loadingAuth
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAuth: (userData, isSignup) => dispatch(actions.auth(userData, isSignup))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
