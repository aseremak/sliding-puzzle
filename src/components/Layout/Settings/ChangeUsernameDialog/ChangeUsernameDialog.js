import React, { Component } from 'react';
import { connect } from 'react-redux';

import './ChangeUsernameDialog.css';

import Modal from '../../../UI/Modal/Modal';
import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import Spinner from '../../../UI/Spinner/Spinner';

import { updateObject, checkValidity } from '../../../../shared/utility';
import * as actions from '../../../../store/actions';

import LangContext from '../../../../hoc/context/LangContext';
import { txt } from '../../../../shared/dict';

class ChangeUsername extends Component {
	static contextType = LangContext;
	state = {
		formIsValid: false,
		controls: {
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
			if (updatedControls[controlName].valid !== undefined) {
				formIsValid = formIsValid && updatedControls[controlName].valid;
			}
		}
		this.setState({ controls: updatedControls, formIsValid: formIsValid });
	};


	onChangeUsernameHandler = () => {
		this.props.onChangeUsername(this.state.controls.username.value);
	}
	
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
		const disabled = !this.state.formIsValid || (this.state.controls.username.value === this.props.username);

		let changeUsernameForm = null,
			spinner = null;
		if (this.props.loading) {
			spinner = this.props.loading ? <Spinner /> : null;
		} else {
			changeUsernameForm = (
				<div className="ChangeUsername stdBlock">
					<p>{txt.ENTER_NEW_USERNAME[this.context.lang]}</p>
					{form}
					{errorMessage}
					<Button 
						disabled={disabled} 
						callClick={this.onChangeUsernameHandler}
					>{txt.OK[this.context.lang]}
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
		content = <p>{txt.USERAME_CHANGED[this.context.lang]}</p>
		}		

		const okCaption = txt.OK[this.context.lang];
		const cancelCaption = txt.CANCEL[this.context.lang];

		return (
			<Modal>
				{content}
				<br/>
				<Button
					callClick={this.props.clickCancelCall}
					>{this.props.actionSuccess ? okCaption : cancelCaption}
				</Button>
			</Modal>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		error: state.error,
		loading: state.loadingAuth,
		actionSuccess: state.actionSuccess,
		username: state.user.username,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onChangeUsername: (name) => dispatch(actions.changeUsername(name))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeUsername);
