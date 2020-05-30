import axios from '../axios';

const KEY = process.env.REACT_APP_API_KEY;

const USERS_URL = 'https://identitytoolkit.googleapis.com/v1/';

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
export const HIGHSCORES_GET_START = 'HIGHSCORES_GET_START';
export const HIGHSCORES_GET_SUCCESS = 'HIGHSCORES_GET_SUCCESS';
export const HIGHSCORES_GET_FAIL = 'HIGHSCORES_GET_FAIL';
export const HIGHSCORES_COMPARE_NEW_SCORE_START = 'HIGHSCORES_COMPARE_NEW_SCORE_START';
export const HIGHSCORES_COMPARE_NEW_SCORE_END = 'HIGHSCORES_COMPARE_NEW_SCORE_END';
export const USER_GET_PERSONAL_BESTS_FROM_STORAGE = 'USER_GET_PERSONAL_BESTS_FROM_STORAGE';
export const USER_SET_PERSONAL_BESTS = 'USER_SET_PERSONAL_BESTS';
export const USER_NEW_PERSONAL_BEST = 'USER_NEW_PERSONAL_BEST';
export const USER_PATCH_PERSONAL_BEST_START = 'USER_PATCH_PERSONAL_BEST';
export const USER_PATCH_PERSONAL_BEST_SUCCESS = 'USER_PATCH_PERSONAL_BEST_SUCCESS';
export const USER_PATCH_PERSONAL_BEST_FAIL = 'USER_PATCH_PERSONAL_BEST_FAIL';

//ACTION CREATORS;
export const auth_start = () => {
	return {
		type: AUTH_START
	};
};

const auth_success = (user) => {
	return {
		type: AUTH_SUCCESS,
		user: user
	};
};

const auth_fail = (error) => {
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
		anonymous: false,
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

		const url = isSignup ? USERS_URL + 'accounts:signUp?key=' : USERS_URL + 'accounts:signInWithPassword?key=';

		axios
			.post(url + KEY, data)
			.then((res) => {
				user.idToken = res.data.idToken;
				user.localId = res.data.localId;
				if (isSignup) {
					// POST username AND CREATE EMPTY personalBests OBJECT
					const newUser = {
						id: user.localId,
						username: userData.username,
						anonymous: false,
						personalBests: {}
					};
					axios
						.post('users.json', newUser)
						.then((res) => {
							user.username = userData.username;
							user.personalBests = {};
							user.usersId = res.data.name;
							dispatch(auth_success(user));
							dispatch(auth_close_window());
						})
						.catch((error) => {
							dispatch(
								auth_fail(
									error.response.data.error || { message: 'Posting new user data - unknown error' }
								)
							);
						});
				} else {
					// GET username AND personalBests
					const queryParams = `?orderBy="id"&equalTo="${user.localId}"`;
					axios
						.get('users.json' + queryParams)
						.then((res) => {
							const keysArr = Object.keys(res.data);
							if (keysArr.length === 1) {
								user.usersId = keysArr[0];
								user.username = res.data[keysArr[0]].username;
								user.anonymous = false;
								user.personalBests = res.data[keysArr[0]].personalBests
									? { ...res.data[keysArr[0]].personalBests }
									: {};
								dispatch(auth_success(user));
								dispatch(auth_close_window());
							} else {
								dispatch(auth_fail({ message: 'Getting user data from USERS failed' }));
							}
						})
						.catch((error) => {
							dispatch(auth_fail(error.response.data.error || { message: 'Logging in - unknown error' }));
						});
				}
			})
			.catch((error) => {
				dispatch(
					auth_fail(error.response.data.error || { message: 'Logging in / Signing up - unknown error' })
				);
			});
	};
};

export const auth_logout = () => {
	return (dispatch) => {
		dispatch({
			type: AUTH_LOGOUT
		});
		dispatch(user_get_personal_best_from_storage());
	};
};

export const change_username = (newUsername) => {
	return (dispatch, getState) => {
		dispatch({ type: CHANGE_USERNAME_START });
		axios
			.put(`users/${getState().user.usersId}/username.json`, `"${newUsername}"`)
			.then((res) => {
				dispatch({
					type: CHANGE_USERNAME_SUCCESS,
					newUsername: newUsername
				});
			})
			.catch((error) => {
				dispatch({
					type: CHANGE_USERNAME_FAIL,
					error: error.response ? error.response.data.error : { message: 'Changing username - unknown error' }
				});
			});
	};
};

export const highscores_get = () => {
	return (dispatch) => {
		dispatch({ type: HIGHSCORES_GET_START });
		axios
			.get('highscores.json')
			.then((res) => {
				if (res.data) {
					console.log(res.data);
					dispatch({
						type: HIGHSCORES_GET_SUCCESS,
						highscores: res.data
					});
				} else {
					dispatch({
						type: HIGHSCORES_GET_FAIL,
						error: { message: 'Getting user data from USERS failed' }
					});
				}
			})
			.catch((error) => {
				dispatch(auth_fail(error.response.data.error || { message: 'Getting highscores - unknown error' }));
			});
	};
};

export const user_get_personal_best_from_storage = () => {
	console.log('[actions.js] user_get_personal_best_from_storage');
	return (dispatch) => {
		dispatch({ type: USER_GET_PERSONAL_BESTS_FROM_STORAGE });
		let personalBests = {};
		try {
			const scores = localStorage.getItem('slidePuzzleScores');
			if (scores) {
				personalBests = JSON.parse(scores);
				dispatch(user_set_personal_bests(personalBests));
			}
		} catch (error) {
			console.log('ERROR');
		}
	};
};

export const user_set_personal_bests = (personalBests) => {
	return {
		type: USER_SET_PERSONAL_BESTS,
		personalBests: personalBests
	};
};

export const user_new_personal_best = (gameType, time) => {
	return (dispatch, getState, type = gameType, tim = time) => {
		dispatch({
			type: USER_NEW_PERSONAL_BEST,
			gameType: type,
			time: tim
		});
		if (!getState().user.anonymous) {
			dispatch({ type: USER_PATCH_PERSONAL_BEST_START });
			axios
				.patch(`users/${getState().user.usersId}/personalBests.json`, { [type]: tim })
				.then((res) => {
					dispatch({ type: USER_PATCH_PERSONAL_BEST_SUCCESS });
				})
				.catch((error) => {
					dispatch({
						type: USER_PATCH_PERSONAL_BEST_FAIL,
						error: error.response.data.error
					});
				});
		}
	};
};

export const highscores_compare_new_score = (newScore) => {
	return (dispatch, getState, score=newScore) => {
		dispatch({ type: HIGHSCORES_COMPARE_NEW_SCORE_START} );
		console.log('highscores before highscores_get', getState().highscores);
		dispatch(highscores_get());
		console.log('highscores after highscores_get', getState().highscores);
		dispatch({ type: HIGHSCORES_COMPARE_NEW_SCORE_END} );
	}
}
