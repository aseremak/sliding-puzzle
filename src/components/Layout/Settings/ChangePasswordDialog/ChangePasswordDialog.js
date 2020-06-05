import React, { Component } from 'react';
import { connect } from 'react-redux';

import './ChangePasswordDialog.css';

import Modal from '../../../UI/Modal/Modal';
import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import Spinner from '../../../UI/Spinner/Spinner';

import { updateObject, checkValidity } from '../../../../shared/utility';
import * as actions from '../../../../store/actions';

class ChangePassword extends Component {
	state = {
		formIsValid: false,
		controls: {
			oldPassword: {
				elementType: 'input',
				elementConfig: {
					type: 'password',
					placeholder: 'Old password'
				},
				validation: {
					required: true,
					minLength: 6
				},
				valid: false,
				touched: false,
				value: ''
			},
			newPassword: {
				elementType: 'input',
				elementConfig: {
					type: 'password',
					placeholder: 'New password (min 6 chars)'
				},
				validation: {
					required: true,
					minLength: 6
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
			if (updatedControls[controlName].valid !== undefined) {
				formIsValid = formIsValid && updatedControls[controlName].valid;
			}
		}
		this.setState({ controls: updatedControls, formIsValid: formIsValid });
	};

	onChangePasswordHandler = (event) => {
		console.log('onChangeUSernameHandler in ChangePasswordDialog');
		this.props.onChangePassword(this.state.controls.oldPassword.value, this.state.controls.newPassword.value);
	};

	render() {
		const formElementsArray = [];
		for (let key in this.state.controls) {
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

		const errorMessage = this.props.error ? <p className="ErrorMessage">{this.props.error.message}</p> : null;

		let changeUsernameForm = null,
			spinner = null;
		if (this.props.loading) {
			spinner = this.props.loading ? <Spinner /> : null;
		} else {
			changeUsernameForm = (
				<div className="ChangePassword stdBlock">
					<p>Enter old password, new password and click Change Password button</p>
					{form}
					{errorMessage}
					<Button disabled={!this.state.formIsValid} callClick={this.onChangePasswordHandler}>
						Change Password
					</Button>
				</div>
			);
		}

		let content = (
			<div>
				{changeUsernameForm}
				{spinner}
			</div>
		);
		if (this.props.actionSuccess) {
			content = <p>Your password was changed successfully.</p>
		}

		return (
			<Modal>
				{content}
				<br/>
				<Button callClick={this.props.clickCancelCall}>{this.props.actionSuccess ? 'OK' : 'Cancel'}</Button>
			</Modal>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		error: state.error,
		loading: state.loadingAuth,
		actionSuccess: state.actionSuccess
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onChangePassword: (oldpass, newpass) => dispatch(actions.changePassword(oldpass, newpass))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
