import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Auth.css';

import Modal from '../../components/UI/Modal/Modal';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

import { updateObject, checkValidity } from '../../shared/utility';
import * as actions from '../../store/actions';

class Auth extends Component {
	state = {
		formIsValid: false,
		isSignup: false,
		hideErrorMessage: false,
		controls: {
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Mail Address'
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
					placeholder: 'Password (min 6 chars)'
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
					placeholder: 'Username (min 3 chars)'
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
				// SKIP CHECKING VALICATION OF USERNAME WHICH IS INVISIBLE
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
					<p>{this.state.isSignup ? 'Sign up' : 'Log in'} using your email and password</p>
					{form}
					{errorMessage}
					<Button disabled={!this.state.formIsValid} callClick={this.onLoginOrSignupHandler}>
						{this.state.isSignup ? 'Sign Up' : 'Log In'}
					</Button>
				</div>
			);
			if (!this.state.isSignup) {
				signupBlock = (
					<div className="Auth stdBlock">
						<p>of if you would like to create a new account then click button below</p>
						<Button callClick={this.onSwitchToSignupClickHandler}>Sign Up</Button>
					</div>
				);
			}
		}

		return (
			<Modal
				clickCall={() => {
					console.log('AUTH CLICKED');
				}}>
				<div>
					{loginBlock}
					{signupBlock}
					{spinner}
				</div>
				<Button callClick={this.props.clickCancelCall}>Cancel</Button>
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
