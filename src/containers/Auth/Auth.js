import React, { Component } from "react";
import { connect } from "react-redux";

import "./Auth.css";

import Modal from "../../components/UI/Modal/Modal";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import MessageBox from "../../components/UI/MessageBox/MessageBox";

import { updateObject, checkValidity } from "../../shared/utility";
import * as actions from "../../store/actions";

import LangContext from "../../hoc/context/LangContext";
import { txt } from "../../shared/dict";

class Auth extends Component {
  static contextType = LangContext;

  state = {
    formIsValid: false,
    isSignup: false,
    isPasswordReset: false,
    hideErrorMessage: false,
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: txt.MAIL_ADDRESS[this.context.lang],
        },
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
        value: "",
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: txt.PASSWORD_MIN6[this.context.lang],
        },
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
        value: "",
      },
      username: {
        elementType: "input",
        elementConfig: {
          type: "username",
          placeholder: txt.USERNAME_MIN3[this.context.lang],
        },
        validation: {
          required: true,
          minLength: 3,
        },
        valid: false,
        touched: false,
        value: "",
      },
    },
  };

  isFormValid = (controls, skipUsername, skipPassword) => {
    let formIsValid = true;
    for (let controlName in controls) {
      if (skipUsername && controlName === "username") {
        // USERNAME IS INVISIBLE => SKIP CHECKING USERNAME
        continue;
      }
      if (skipPassword && controlName === "password") {
        // PASSWORD IS INVISIBLE => SKIP CHECKING USERNAME
        continue;
      }
      if (controls[controlName].valid !== undefined) {
        formIsValid = formIsValid && controls[controlName].valid;
      }
    }
    return formIsValid;
  };

  inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(this.state.controls, {
      [controlName]: updateObject(this.state.controls[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true,
      }),
    });

    const skipUsername = !this.state.isSignup;
    const skipPassword = this.state.isPasswordReset;
    let formIsValid = this.isFormValid(
      updatedControls,
      skipUsername,
      skipPassword
    );

    this.setState({
      controls: updatedControls,
      formIsValid: formIsValid,
    });
  };

  onLoginOrSignupHandler = () => {
    this.props.onAuth(
      {
        email: this.state.controls.email.value,
        password: this.state.controls.password.value,
        username: this.state.controls.username.value,
      },
      this.state.isSignup
    );
    this.setState({ hideErrorMessage: false });
	};
	
	onResetPasswordHandler = () => {
    const messages = {
      emailWasSent: txt.PASS_RESET_OK[this.context.lang],
      errorOccured: txt.PASS_RESET_FAIL[this.context.lang]
    }
		this.props.onPasswordReset(
      this.state.controls.email.value,
      messages
      );
		this.setState({isPasswordReset: false});
	}

  onSwitchToSignupClickHandler = () => {
    this.setState({
      isSignup: true,
      hideErrorMessage: this.props.error ? true : false,
    });
  };

  onPasswordForgetToggleClickHandler = () => {
    this.setState((prevState) => {
      const controls = prevState.controls;
      const skipUsername = !prevState.isSignup;
      const skipPassword = !prevState.isPasswordReset;
      const formIsValid = this.isFormValid(
        controls,
        skipUsername,
        skipPassword
      );
      return {
        isPasswordReset: !prevState.isPasswordReset,
        formIsValid: formIsValid,
      };
    });
  };
  
  onCloseMessageHandler = () => {
    this.props.onMessageClose();
    this.props.onResetErrors();
  }
	
	

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      if (
        (key === "username" && !this.state.isSignup) ||
        (key === "password" && this.state.isPasswordReset)
      ) {
        continue;
      }
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
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
      spinner = null,
      instruction = null,
      buttonCaption = null,
      onClickButtonHandler = null;

    if (this.state.isSignup) {
      instruction =
        txt.SIGNUP[this.context.lang] +
        txt.USING_EMAIL_PASSWORD[this.context.lang];
      buttonCaption = txt.SIGNUP[this.context.lang];
      onClickButtonHandler = this.onLoginOrSignupHandler;
    } else {
      if (this.state.isPasswordReset) {
        instruction = txt.PASS_RESET_INSTR[this.context.lang];
        buttonCaption = txt.PASS_RESET[this.context.lang];
        onClickButtonHandler = this.onResetPasswordHandler;
      } else {
        instruction =
          txt.LOGIN[this.context.lang] +
          txt.USING_EMAIL_PASSWORD[this.context.lang];
        buttonCaption = txt.LOGIN[this.context.lang];
        onClickButtonHandler = this.onLoginOrSignupHandler;
      }
    }

    const PasswordForgetToggle = () => (
      <div
        className="PasswordForgetLink"
        onClick={this.onPasswordForgetToggleClickHandler}
      >
        {this.state.isPasswordReset
          ? txt.PASS_FORGET_TRY_AGAIN[this.context.lang]
          : txt.PASS_FORGET[this.context.lang]}
      </div>
    );

    if (this.props.loading) {
      spinner = this.props.loading ? <Spinner /> : null;
    } else {
      loginBlock = (
        <div className="Auth stdBlock">
          <p>{instruction}</p>
          {form}
          {!this.state.isSignup && <PasswordForgetToggle />}
          {errorMessage}
          <Button
            disabled={!this.state.formIsValid}
            callClick={onClickButtonHandler}
          >
            {buttonCaption}
          </Button>
        </div>
      );
      if (!this.state.isSignup) {
        signupBlock = (
          <div className="Auth stdBlock">
            <p>{txt.CREATE_ACCOUNT[this.context.lang]}</p>
            <Button callClick={this.onSwitchToSignupClickHandler}>
              {txt.SIGNUP[this.context.lang]}
            </Button>
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
        <Button callClick={this.props.clickCancelCall}>
          {txt.CANCEL[this.context.lang]}
        </Button>
				{this.props.message && <MessageBox message={this.props.message} onClick={this.onCloseMessageHandler}/>}
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.error,
		loading: state.loadingAuth,
		message: state.message,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (userData, isSignup) => dispatch(actions.auth(userData, isSignup)),
		onPasswordReset: (email, messages) => dispatch(actions.sendPasswordResetEmail(email, messages)),
    onMessageClose: () => dispatch(actions.messageClose()),
    onResetErrors: () => dispatch(actions.resetErrors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
