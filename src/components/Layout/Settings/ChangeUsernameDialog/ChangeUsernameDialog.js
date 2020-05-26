import React, { Component } from 'react';
import { connect } from 'react-redux';

import './ChangeUsernameDialog.css';

import Modal from '../../../UI/Modal/Modal';
import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import Spinner from '../../../UI/Spinner/Spinner';

import { updateObject, checkValidity } from '../../../../shared/utility';
import * as actions from '../../../../store/actions';

class ChangeUsername extends Component {
	state = {
		formIsValid: false,
		controls: {
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
			if (updatedControls[controlName].valid !== undefined) {
				formIsValid = formIsValid && updatedControls[controlName].valid;
			}
		}
		this.setState({ controls: updatedControls, formIsValid: formIsValid });
	};


	onChangeUsernameHandler = () => {
		console.log('onChangeUSernameHandler in ChangeUsernameDialog');
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

		const errorMessage = this.props.error ? <p>{this.props.error.message}</p> : null;

		let changeUsernameForm = null,
			spinner = null;
		if (this.props.loading) {
			spinner = this.props.loading ? <Spinner /> : null;
		} else {
			changeUsernameForm = (
				<div className="ChangeUsername stdBlock">
					<p>Enter new User Name</p>
					{form}
					{errorMessage}
					<Button 
						disabled={!this.state.formIsValid} 
						callClick={this.onChangeUsernameHandler}
					>
						Change User Name
					</Button>
				</div>
			);
		}

		return (
			<Modal
				clickCall={() => {
					console.log('AUTH CLICKED');
				}}>
				<div>
					{changeUsernameForm}
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
		loading: state.loading
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onChangeUsername: (name) => dispatch(actions.change_username(name))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeUsername);
