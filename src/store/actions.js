import axios from '../axios';

import { AVAILABLE_GAMES } from '../shared/utility';

const KEY = process.env.REACT_APP_API_KEY;

const AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/';

// ACTION TYPES
export const RESET_ERRORS = 'RESET_ERRORS';

export const AUTH_START = 'AUTH_START';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAIL = 'AUTH_FAIL';
export const AUTH_OPEN_WINDOW = 'AUTH_OPEN_WINDOW';
export const AUTH_CLOSE_WINDOW = 'AUTH_CLOSE_WINDOW';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_AUTO_LOGIN = 'AUTH_AUTO_LOGIN';

export const CHANGE_USERNAME_START = 'CHANGE_USERNAME_START';
export const CHANGE_USERNAME_SUCCESS = 'CHANGE_USERNAME_SUCCESS';
export const CHANGE_USERNAME_FAIL = 'CHANGE_USERNAME_FAIL';
export const CHANGE_PASSWORD_START = 'CHANGE_PASSWORD_START';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAIL = 'CHANGE_PASSWORD_FAIL';

export const HIGHSCORES_GET_START = 'HIGHSCORES_GET_START';
export const HIGHSCORES_GET_SUCCESS = 'HIGHSCORES_GET_SUCCESS';
export const HIGHSCORES_GET_FAIL = 'HIGHSCORES_GET_FAIL';
export const HIGHSCORES_NEW_SCORE_CHECK_START = 'HIGHSCORES_NEW_SCORE_CHECK_START';
export const HIGHSCORES_NEW_SCORE_CHECK_END = 'HIGHSCORES_NEW_SCORE_CHECK_END';
export const HIGHSCORES_NEW_SCORE_CHECK_ERROR = 'HIGHSCORES_NEW_SCORE_CHECK_ERROR';
export const HIGHSCORES_NEW_SCORE_UPDATE = 'HIGHSCORES_NEW_SCORE_UPDATE';
export const HIGHSCORES_UPDATE_USERNAME = 'HIGHSCORES_UPDATE_USERNAME'; 

export const USER_GET_PERSONAL_BESTS_FROM_STORAGE = 'USER_GET_PERSONAL_BESTS_FROM_STORAGE';
export const USER_SET_PERSONAL_BESTS = 'USER_SET_PERSONAL_BESTS';
export const USER_NEW_PERSONAL_BEST = 'USER_NEW_PERSONAL_BEST';
export const USER_PATCH_PERSONAL_BEST_START = 'USER_PATCH_PERSONAL_BEST';
export const USER_PATCH_PERSONAL_BEST_SUCCESS = 'USER_PATCH_PERSONAL_BEST_SUCCESS';
export const USER_PATCH_PERSONAL_BEST_FAIL = 'USER_PATCH_PERSONAL_BEST_FAIL';

export const GAME_PANEL_OPEN = 'GAME_PANEL_OPEN';
export const GAME_PANEL_CLOSE = 'GAME_PANEL_CLOSE';
export const HIGHSCORES_PANEL_OPEN = 'HIGHSCORES_PANEL_OPEN';
export const HIGHSCORES_PANEL_CLOSE = 'HIGHSCORES_PANEL_CLOSE';
export const TIMER_START = 'TIMER_START';
export const TIMER_STOP = 'TIMER_STOP';

//ACTION CREATORS
export const resetErrors = () => {
	return {
		type: RESET_ERRORS
	}
}

export const authStart = () => {
	return {
		type: AUTH_START
	};
};

const authSuccess = (user) => {
	return {
		type: AUTH_SUCCESS,
		user: user
	};
};

const authFail = (error) => {
	return {
		type: AUTH_FAIL,
		error: error
	};
};

export const authOpenWindow = () => {
	return {
		type: AUTH_OPEN_WINDOW
	};
};

export const authCloseWindow = () => {
	return {
		type: AUTH_CLOSE_WINDOW
	};
};

const authCheckTimeout = (expirationTime) => {
	return (dispatch) => {
		setTimeout(() => {
			dispatch(authLogout());
		}, expirationTime * 1000);
	};
};

const checkIfUsernameAvailable = name => {
	return new Promise((resolve, reject) => {
		if (name.toUpperCase() === 'ANONYMOUS' || name === '---') {
			reject({ message: 'USERNAME NOT ALLOWED'});
		} else {
			const queryParams = `?orderBy="username"&equalTo="${name}"`;
			axios
				.get('users.json' + queryParams)
				.then((res) => {
					if( Object.keys(res.data).length === 0 ) {
						resolve();
					} else {
						reject({ message: 'USERNAME EXIST'});
					}
				})
				.catch((error) => {
					reject(error);
				});				
		}
	})
}

export const auth = (userData, isSignup) => {
	return dispatch => {
		dispatch(authStart());
		if (isSignup) {
			checkIfUsernameAvailable(userData.username)
				.then( () => {
					dispatch(authUser(userData, isSignup));
				})
				.catch(error => {
					console.dir(error);
					dispatch(authFail(error))
				})
		} else {
			dispatch(authUser(userData, isSignup));
		}
	};
}

const authUser = (userData, isSignup) => {
	return dispatch => {
		const 
			user = {
				username: userData.username,
				anonymous: false,
				localId: null,
				usersId: null,
				idToken: null,
				personalBests: undefined
			},
			data = {
				email: userData.email,
				password: userData.password,
				returnSecureToken: true
			},
			url = isSignup ? AUTH_URL + 'accounts:signUp?key=' : AUTH_URL + 'accounts:signInWithPassword?key=';

		axios
		.post(url + KEY, data)
		.then((res) => {
			user.idToken = res.data.idToken;
			user.localId = res.data.localId;
			const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000);
			try {
				localStorage.setItem('slidePuzzleIdToken', res.data.idToken);
				localStorage.setItem('slidePuzzleLocalId', res.data.localId);
				localStorage.setItem('slidePuzzleExpirationDate', expirationDate);
			} catch {};
			dispatch(authCheckTimeout(res.data.expiresIn));
			if (!isSignup) {
				dispatch(authGetUserData(user))
			} else {
				// POST username AND CREATE EMPTY personalBests OBJECT
				const newUser = {
					id: user.localId,
					username: user.username,
					anonymous: false,
					personalBests: {}
				};
				axios
					.post('users.json?auth=' + user.idToken, newUser)
					.then((res) => {
						user.personalBests = {};
						user.usersId = res.data.name;
						dispatch(authSuccess(user));
						dispatch(authCloseWindow());
					})
					.catch((error) => {
						dispatch(authFail(error.response.data.error || { message: 'Posting new user data - unknown error' }));
					});				
			}
		})
		.catch((error) => {
			dispatch(
				authFail(error.response.data.error || { message: 'Logging in / Signing up - unknown error' })
			);
		});		
	}
}

export const authLogout = () => {
	return (dispatch) => {
		try {
			localStorage.removeItem('slidePuzzleIdToken');
			localStorage.removeItem('slidePuzzleLocalId');
			localStorage.removeItem('slidePuzzleExpirationDate');		
		} catch {};			
		dispatch({
			type: AUTH_LOGOUT
		});
		dispatch(userGetPersonalBestFromStorage());
	}
};

const authGetUserData = ( user ) => {
	return dispatch => {
		// GET username AND personalBests
		const queryParams = `?orderBy="id"&equalTo="${user.localId}"&auth=${user.idToken}`;
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
					dispatch(authSuccess(user));
					dispatch(authCloseWindow());
				} else {
					dispatch(authFail({ message: 'Getting user data from USERS failed' }));
				}
			})
			.catch((error) => {
				dispatch(authFail(error.response.data.error || { message: 'Logging in - unknown error' }));
			});		
	}
}

export const authAutoLogin = () => {
	return dispatch => {
		let
			idToken = null,
			localId = null,
			expirationDate = null;
		let user = undefined;
		try {
			idToken = localStorage.getItem('slidePuzzleIdToken');
			localId = localStorage.getItem('slidePuzzleLocalId');
			expirationDate = new Date(localStorage.getItem('slidePuzzleExpirationDate'));	
			if (idToken && localId && expirationDate) {
				user = {
					localId: localId,
					idToken: idToken
				}
			}					
		} catch {};	
		dispatch({ 
			type: AUTH_AUTO_LOGIN,
			user: user
		});		
		if (idToken && localId && expirationDate) {
			// console.log('expirationDate:' + expirationDate);
			if (expirationDate > new Date()) {
				const secondsToLogoutLeft = Math.floor((expirationDate - new Date()) / 1000);
				// console.log('seconds to logout left: ' + secondsToLogoutLeft);
				dispatch(authCheckTimeout(secondsToLogoutLeft));
				dispatch(authGetUserData(user))
			} else {
				dispatch(authLogout())
			}
		} 
	}
}

const changeUsernameFail = error => {
	return {
		type: CHANGE_USERNAME_FAIL,
		error: error
	}
}

export const changeUsername = (newUsername) => {
	return (dispatch, getState) => {
		dispatch({ type: CHANGE_USERNAME_START });
		checkIfUsernameAvailable(newUsername)
			.then( () => {
				axios
				// UPDATE USERNAME IN FIREBASE USERS
				.put(`users/${getState().user.usersId}/username.json?auth=${getState().user.idToken}`, `"${newUsername}"`)
				.then((res) => {
					// UPDATE USERNAME IN state.highscores
					const oldUsername = getState().user.username,
						oldHS = getState().highscores,
						newHS = {};
					let usernameExistInHS = false;
					AVAILABLE_GAMES.forEach(gameType => {
						for(let i=0; i<oldHS[gameType].length; i++){
							if ( i=== 0) { newHS[gameType] = [] };
							let username = oldHS[gameType][i].username;
							if (oldHS[gameType][i].username === oldUsername) {
								usernameExistInHS = true;
								username = newUsername;
							};		
							newHS[gameType].push({
								score: oldHS[gameType][i].score,
								username: username
							});
						};
					});
					if (usernameExistInHS) {
						dispatch({
							type: HIGHSCORES_UPDATE_USERNAME,
							updatedHighscores: newHS
						});
						// UPDATE USERNAME IN FIREBASE HIGHSCORES
						axios
						.get('highscores.json')
						.then((res) => {
							if (res.data) {
								const highscores = res.data;
								Object.keys(highscores).forEach( gameType => {
									highscores[gameType].forEach( highscore => {
										if (highscore.username === oldUsername) {
											highscore.username = newUsername;
										}
									});
								});
								axios
								.patch(`highscores.json?auth=${getState().user.idToken}`, highscores)
								.then((res) => {
									// console.log('highscores in Firebase updated!', res.data);
								});
							};
						})						
					};
				})
				.then((res) => {
					dispatch({
						type: CHANGE_USERNAME_SUCCESS,
						newUsername: newUsername
					});
				})
				.catch((error) => {
					dispatch( changeUsernameFail(
						error.response ? error.response.data.error : { message: 'Changing username - unknown error' }
					));
				});					
			})
			.catch( (error ) => {
				console.dir(error);
				dispatch(changeUsernameFail(error));
			})
	};
};

export const changePassword = (oldpass, newpass) => {
	return (dispatch, getState) => {
		dispatch({ type: CHANGE_PASSWORD_START });
		let data = { idToken: getState().user.idToken }
		axios	// GET EMAIL
			.post(AUTH_URL + 'accounts:lookup?key=' + KEY, data)
			.then( res => {
				data = {
					email: res.data.users[0].email,
					password: oldpass,
					returnSecureToken: false
				};
				axios // TRY TO LOG IN
					.post(AUTH_URL + 'accounts:signInWithPassword?key=' + KEY, data)
					.then( res => {
						data = {
							idToken: getState().user.idToken,
							password: newpass,
							returnSecureToken: false
						}
						axios // CHANGE PASSWORD
							.post(AUTH_URL + 'accounts:update?key=' + KEY, data)
							.then((res) => {
								dispatch({
									type: CHANGE_PASSWORD_SUCCESS,
								});
							})
							.catch((error) => {
								dispatch({
									type: CHANGE_PASSWORD_FAIL,
									error: error.response ? error.response.data.error : { message: 'Changing password - unknown error' }
								});
							});
					})
					.catch( error => {
						dispatch({
							type: CHANGE_PASSWORD_FAIL,
							error: { message: 'Invalid old password' }
						});
						return null;
					} );
			})
			.catch( error => {
				dispatch({
					type: CHANGE_PASSWORD_FAIL,
					error: error.response ? error.response.data.error : { message: 'Changing password - unknown error' }
				});
			})
	};
};

export const highscoresGet = () => {
	return (dispatch) => {
		dispatch({ type: HIGHSCORES_GET_START });
		return axios
			.get('highscores.json')
			.then((res) => {
				if (res.data) {
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
				dispatch(authFail(error.response.data.error || { message: 'Getting highscores - unknown error' }));
			});
	};
};

export const userGetPersonalBestFromStorage = () => {
	return (dispatch) => {
		dispatch({ type: USER_GET_PERSONAL_BESTS_FROM_STORAGE });
		let personalBests = {};
		try {
			const scores = localStorage.getItem('slidePuzzleScores');
			if (scores) {
				personalBests = JSON.parse(scores);
				dispatch(userSetPersonalBests(personalBests));
			}
		} catch {}
	};
};

export const userSetPersonalBests = (personalBests) => {
	return {
		type: USER_SET_PERSONAL_BESTS,
		personalBests: personalBests
	};
};

export const userNewPersonalBest = (gameType, time) => {
	return (dispatch, getState, type = gameType, tim = time) => {
		dispatch({
			type: USER_NEW_PERSONAL_BEST,
			gameType: type,
			time: tim
		});
		if (!getState().user.anonymous) {
			dispatch({ type: USER_PATCH_PERSONAL_BEST_START });
			axios
				.patch(`users/${getState().user.usersId}/personalBests.json?auth=${getState().user.idToken}`, { [type]: tim })
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

export const highscoresNewScoreCheck = (gameType, score) => {
	return (dispatch, getState) => {
		dispatch({ type: 'HIGHSCORES_NEW_SCORE_CHECK_START' });
		axios.get('highscores.json').then((res) => {
			const 
				highscores = res.data[gameType],
				newHighscore = {
					score: score,
					username: getState().user.username,
					usersId: getState().user.usersId
				};
			let
				rank = null,
				updatedHighscores = null;
			if (highscores) {
				for (let pos = 0; pos < highscores.length; pos++) {
					if (score < highscores[pos].score) {
						rank = pos;
						break;
					}
				}
				if (rank === null && highscores.length < 10) {
					rank = highscores.length;
				}
				if (rank !== null) {
					updatedHighscores = highscores.slice(0, rank).concat(newHighscore, highscores.slice(rank));
					if (updatedHighscores.length > 10) {
						updatedHighscores = updatedHighscores.slice(0, 10);
					}
				}
			} else {
				// HIGHSCORES ARRAY IS EMPTY
				rank = 0;
				updatedHighscores = [newHighscore];
			}

			if (updatedHighscores) {
				dispatch({
					type: HIGHSCORES_NEW_SCORE_UPDATE,
					newHighscore: {
						gameType: gameType,
						value: score,
						rank: rank
					}
				});
				axios
					.patch(`highscores.json?auth=${getState().user.idToken}`, { [gameType]: updatedHighscores })
					.then((res) => {
						// console.log(res.data);
					});
			} else {
				dispatch({ type: 'HIGHSCORES_NEW_SCORE_CHECK_END' });
			}
		})
		.catch( error => {
			dispatch( {
				type: HIGHSCORES_NEW_SCORE_CHECK_ERROR,
				error: error.response.data.error || { message: 'Unable to load highscores due to unknown error' }
			})
		});
	};
};

export const gamePanelOpen = () => {
	return {
		type: GAME_PANEL_OPEN
	}
}

export const gamePanelClose = () => {
	return {
		type: GAME_PANEL_CLOSE
	}
}

export const highscoresPanelOpen = () => {
	return {
		type: HIGHSCORES_PANEL_OPEN
	}
}

export const highscoresPanelClose = () => {
	return {
		type: HIGHSCORES_PANEL_CLOSE
	}
}

export const timerStart = () => {
	return {
		type: TIMER_START
	}
}

export const timerStop = () => {
	return {
		type: TIMER_STOP
	}
}