import axios from '../axios-auth';

const KEY = process.env.REACT_APP_API_KEY;

const firebaseUrl = 'https://slide-puzzle-as.firebaseio.com/';

// ACTION TYPES
export const AUTH_START = 'AUTH_START';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAIL = 'AUTH_FAIL';
export const AUTH_OPEN_WINDOW = 'AUTH_OPEN_WINDOW';
export const AUTH_CLOSE_WINDOW = 'AUTH_CLOSE_WINDOW';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const CHANGE_USERNAME_START = 'CHANGE_USERNAME_START';
export const CHANGE_USERNAME_SUCCESS = 'CHANGE_USERNAME_SUCCESS';
export const CHANGE_USERNAME_FAIL = 'CHANGE_USERNAME_FAIL';
export const CHECK_STORAGE_ENABLED = 'CHECK_STORAGE_ENABLED'; 


//ACTION CREATORS;
export const auth_start = () => {
	return {
		type: AUTH_START
	};
};

export const auth_success = (user, usersId) => {
	return {
		type: AUTH_SUCCESS,
		user: user
	};
};

export const auth_fail = (error) => {
	return {
		type: AUTH_FAIL,
		error: error
	};
};

export const auth_open_window = () => {
	return {
		type: AUTH_OPEN_WINDOW
	};
};

export const auth_close_window = () => {
	return {
		type: AUTH_CLOSE_WINDOW
	};
};
export const auth = (userData, isSignup) => {
	// userData: email, password, username
	const user = {
		username: userData.username,
		localId: null,
		usersId: null,
		idToken: null,
		personalBests: undefined
	};
	return (dispatch) => {
		dispatch(auth_start());
		const data = {
			email: userData.email,
			password: userData.password,
			returnSecureToken: true
		};

		const url = isSignup ? 'accounts:signUp?key=' : 'accounts:signInWithPassword?key=';

		axios
			.post(url + KEY, data)
			.then((res) => {
				console.log(res);
				user.idToken = res.data.idToken;
				user.localId = res.data.localId;
				if (isSignup) {
					// POST username AND CREATE EMPTY personalBests OBJECT
					user.username = userData.username;
					user.personalBest = {};
					const newUser = {
						id: user.localId,
						username: userData.username,
						personalBest: {}
					};
					axios
						.post(firebaseUrl + 'users.json', newUser)
						.then((res) => {
							console.log('success', res);
							user.usersId = res.data.name;
							dispatch(auth_success(user));
							dispatch(auth_close_window());
						})
						.catch((error) => {
							console.dir(error);
							console.log(error.response.data.error.message);
							dispatch(auth_fail(error.response.data.error));
						});
				} else {
					// GET username AND personalBests
					const queryParams = `?orderBy="id"&equalTo="${user.localId}"`;
					axios
						.get(firebaseUrl + 'users.json' + queryParams)
						.then((res) => {
							console.log('get name and personalBests .... success', res);
							console.log(res.data);
							const keysArr = Object.keys(res.data);
							if (keysArr.length === 1) {
								user.usersId = keysArr[0];
								user.username = res.data[keysArr[0]].username;
								user.personalBests = res.data[keysArr[0]].personalBests ? { ...res.data[keysArr[0]].personalBests } : {};
								dispatch(auth_success(user));
								dispatch(auth_close_window());
							} else {
								dispatch(
									auth_fail({
										message: 'Getting user data from USERS failed'
									})
								);
							}
						})
						.catch((error) => {
							console.dir(error);
							console.log(error.response.data.error.message);
							dispatch(auth_fail(error.response.data.error));
						});
				}
			})
			.catch((error) => {
				console.dir(error);
				console.log(error.response.data.error.message);
				dispatch(auth_fail(error.response.data.error));
			});
	};
};

export const auth_logout = () => {
	return {
		type: AUTH_LOGOUT
	};
}

export const change_username_start = () => {
		return {
			type: CHANGE_USERNAME_START
		}
}

export const change_username_success = (newUsername) => {
	return {
		type: CHANGE_USERNAME_SUCCESS,
		newUsername: newUsername
	}
}

export const change_username_fail = (error) => {
	return {
		type: CHANGE_USERNAME_FAIL,
		error: error
	}
}

export const change_username = (newUsername) => {
	return (dispatch, getState) => {
		dispatch(change_username_start());
		console.log('trying to change username from ' + getState().user.username + ' to ' + newUsername);
		console.log(getState());
		axios.put(firebaseUrl + `users/${getState().user.usersId}/username.json`, `"${newUsername}"`)
			.then(res => {
				console.log('putting data OK', res.data);
				dispatch(change_username_success(newUsername))
			})
			.catch(error => {
				console.dir(error);
				console.log(error.response.data.error.message);
				dispatch(auth_fail(error.response.data.error));
			})		
	}
}

export const check_storage_enabled = () => {
	return {
		type: CHECK_STORAGE_ENABLED
	}
}