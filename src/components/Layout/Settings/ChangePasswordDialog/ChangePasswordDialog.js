import React, { Component } from 'react';
import { connect } from 'react-redux';

import './ChangePasswordDialog.css';

import Modal from '../../../UI/Modal/Modal';
import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import Spinner from '../../../UI/Spinner/Spinner';

import { updateObject, checkValidity } from '../../../../shared/utility';
import * as actions from '../../../../store/actions';

import LangContext from '../../../../hoc/context/LangContext';
import { txt } from '../../../../shared/dict';

class ChangePassword extends Component {
	static contextType = LangContext;

	state = {
		formIsValid: false,
		controls: {
			oldPassword: {
				elementType: 'input',
				elementConfig: {
					type: 'password',
					placeholder: txt.CURRENT_PASSWORD[this.context.lang]
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
					placeholder: txt.NEW_PASSWORD_MIN6[this.context.lang]
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
					<p>{txt.CHANGE_PASSWORD_DIALOG[this.context.lang]}</p>
					{form}
					{errorMessage}
					<Button disabled={!this.state.formIsValid} callClick={this.onChangePasswordHandler}>
						{txt.OK[this.context.lang]}
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
			content = <p>{txt.PASSWORD_CHANGED[this.context.lang]}</p>
		}

		const okCaption = txt.OK[this.context.lang];
		const cancelCaption = txt.CANCEL[this.context.lang];

		return (
			<Modal>
				{content}
				<br/>
				<Button callClick={this.props.clickCancelCall}>{this.props.actionSuccess ? okCaption : cancelCaption}</Button>
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
