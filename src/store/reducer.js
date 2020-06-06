import * as actionTypes from './actions';
import { updateObject } from '../shared/utility';

const initialState = {
	user: {
		username: 'anonymous',
		anonymous: true,
		localId: null,
		usersId: null,
		idToken: null,
		personalBests: undefined
	},
	actionSuccess: false,
	activePanel: 'user',
	timerStarted: false,
	isLoggedIn: false,
	error: null,
	loadingAuth: false,
	loadingHighscores: false,
	loadingHighscoresError: false,
	loadingPersonalBests: false,
	newHighscore: false, // null = STATE OF CHECKING, false = NO HIGH SCORE OR OBJECT {value: number, rank: number}
	authenticating: false,
	highscores: null,
	thunk: null
};

const AVAILABLE_GAMES = [ '3x3+', '4x4+', '5x5+', '3x3', '4x4', '5x5' ];

const resetErrors = (state, action) => {
	return updateObject(state, {
		error: null,
		actionSuccess: false
	});
};

const authStart = (state, action) => {
	return updateObject(state, {
		error: null,
		loadingAuth: true
	});
};

const authSuccess = (state, action) => {
	return updateObject(state, {
		user: { ...action.user },
		isLoggedIn: true,
		error: null,
		loadingAuth: false,
		activePanel: 'user'
	});
};

const authFail = (state, action) => {
	return updateObject(state, {
		isLoggedIn: false,
		error: action.error,
		loadingAuth: false
	});
};

const authOpenWindow = (state, action) => {
	return updateObject(state, {
		authenticating: true,
		error: null
	});
};
const authCloseWindow = (state, action) => {
	return updateObject(state, {
		authenticating: false
	});
};

const authLogout = (state, action) => {
	return updateObject(state, {
		user: {
			username: 'Anonymous',
			anonymous: true,
			localId: null,
			usersId: null,
			idToken: null,
			personalBests: {}
		},
		isLoggedIn: false,
		activePanel: 'user'
	});
};

// ***

const authAutoLogin = (state, action) => {
	if (action.user) {
		return updateObject(state, {
			user: updateObject(state.user, {
				localId: action.user.localId,
				idToken: action.user.idToken
			})
		});
	} else {
		return state;
	}
};

const changeUsernameStart = (state, action) => {
	return updateObject(state, {
		error: null,
		loadingAuth: true,
		actionSuccess: false
	});
};

const changeUsernameSuccess = (state, action) => {
	return updateObject(state, {
		user: updateObject(state.user, { username: action.newUsername }),
		// error: true, MOZE BYŁO TO POTRZEBNE???
		error: false, // MOŻE TAK LEPIEJ?
		loadingAuth: false,
		actionSuccess: true
	});
};

const changeUsernameFail = (state, action) => {
	return updateObject(state, {
		error: action.error,
		loadingAuth: false,
		actionSuccess: false
	});
};

const changePasswordStart = (state, action) => {
	return updateObject(state, {
		error: null,
		loadingAuth: true,
		actionSuccess: false
	});
};

const changePasswordSuccess = (state, action) => {
	return updateObject(state, {
		// error: true, MOZE BYŁO TO POTRZEBNE???
		error: false, // MOŻE TAK LEPIEJ?
		loadingAuth: false,
		actionSuccess: true
	});
};

const changePasswordFail = (state, action) => {
	return updateObject(state, {
		error: action.error,
		loadingAuth: false,
		actionSuccess: false
	});
};

const highscoresGetStart = (state, action) => {
	return updateObject(state, {
		highscores: null,
		error: null,
		loadingHighscores: true
	});
};

const highscoresGetSuccess = (state, action) => {
	// CONVERTS HIGHSCORES OBJECT TAKEN FROM FIREBASE
	// DELETES userId,
	// EMPTY HIGHSCORE REPLACES BY: {score: 99999, username: '---'}
	const highscores = {};

	AVAILABLE_GAMES.forEach((gameType) => {
		if (action.highscores[gameType]) {
			const orgArr = action.highscores[gameType];
			const newArr = [];
			orgArr.forEach((highscore) => {
				newArr.push({
					score: highscore.score,
					username: highscore.username
				});
			});
			highscores[gameType] = newArr;
		} else {
			highscores[gameType] = [
				{
					score: 99999,
					username: '---'
				}
			];
		}
	});
	return updateObject(state, {
		highscores: highscores,
		loadingHighscores: false
	});
};

const highscoresGetFail = (state, action) => {
	const highscores = {};
	AVAILABLE_GAMES.forEach((gameType) => {
		highscores[gameType] = [
			{
				score: 0,
				username: '---'
			}
		];
	});

	return updateObject(state, {
		highscores: highscores,
		error: action.error,
		loadingHighscores: false
	});
};

const userGetPersonalBestFromStorage = (state, action) => {
	return updateObject(state, {
		user: updateObject(state.user, {
			personalBests: {}
		})
	});
};

const userSetPersonalBests = (state, action) => {
	return updateObject(state, {
		user: updateObject(state.user, {
			personalBests: action.personalBests
		})
	});
};

const userNewPersonalBest = (state, action) => {
	return updateObject(state, {
		user: updateObject(state.user, {
			personalBests: updateObject(state.user.personalBests, {
				[action.gameType]: action.time
			})
		})
	});
};

const userPatchPersonalBestStart = (state, action) => {
	return updateObject(state, {
		error: null,
		loadingPersonalBests: true
	});
};

const userPatchPersonalBestSuccess = (state, action) => {
	return updateObject(state, {
		error: null,
		loadingPersonalBests: false
	});
};

const userPatchPersonalBestFail = (state, action) => {
	return updateObject(state, {
		error: action.error,
		loadingPersonalBests: false
	});
};

const highscoresNewScoreCheckStart = (state, action) => {
	return updateObject(state, {
		newHighscore: null,
		loadingHighscoresError: false
	});
};

const highscoresNewScoreCheckEnd = (state, action) => {
	return updateObject(state, {
		newHighscore: false
	});
};

const highscoresNewScoreCheckError = (state, action) => {
	return updateObject(state, {
		newHighscore: false,
		loadingHighscoresError: action.error
	});
};

const highscoresNewScoreUpdate = (state, action) => {
	return updateObject(state, {
		newHighscore: { ...action.newHighscore }
	});
};

const gamePanelOpen = (state, action) => {
	return updateObject(state, { activePanel: 'game' });
};

const gamePanelClose = (state, action) => {
	return updateObject(state, { activePanel: 'user' });
};

const highscoresPanelOpen = (state, action) => {
	return updateObject(state, { activePanel: 'highscores' });
};

const highscoresPanelClose = (state, action) => {
	return updateObject(state, { activePanel: 'user' });
};


const timerStart = (state, action) => {
	return updateObject(state, { timerStarted: true });
};

const timerStop = (state, action) => {
	return updateObject(state, { timerStarted: false });
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.RESET_ERRORS:
			return resetErrors(state, action);

		case actionTypes.AUTH_START:
			return authStart(state, action);
		case actionTypes.AUTH_SUCCESS:
			return authSuccess(state, action);
		case actionTypes.AUTH_FAIL:
			return authFail(state, action);
		case actionTypes.AUTH_OPEN_WINDOW:
			return authOpenWindow(state, action);
		case actionTypes.AUTH_CLOSE_WINDOW:
			return authCloseWindow(state, action);
		case actionTypes.AUTH_LOGOUT:
			return authLogout(state, action);
		case actionTypes.AUTH_AUTO_LOGIN:
			return authAutoLogin(state, action);

		case actionTypes.CHANGE_USERNAME_START:
			return changeUsernameStart(state, action);
		case actionTypes.CHANGE_USERNAME_SUCCESS:
			return changeUsernameSuccess(state, action);
		case actionTypes.CHANGE_USERNAME_FAIL:
			return changeUsernameFail(state, action);

		case actionTypes.CHANGE_PASSWORD_START:
			return changePasswordStart(state, action);
		case actionTypes.CHANGE_PASSWORD_SUCCESS:
			return changePasswordSuccess(state, action);
		case actionTypes.CHANGE_PASSWORD_FAIL:
			return changePasswordFail(state, action);

		case actionTypes.HIGHSCORES_GET_START:
			return highscoresGetStart(state, action);
		case actionTypes.HIGHSCORES_GET_SUCCESS:
			return highscoresGetSuccess(state, action);
		case actionTypes.HIGHSCORES_GET_FAIL:
			return highscoresGetFail(state, action);

		case actionTypes.HIGHSCORES_NEW_SCORE_CHECK_START:
			return highscoresNewScoreCheckStart(state, action);
		case actionTypes.HIGHSCORES_NEW_SCORE_CHECK_ERROR:
			return highscoresNewScoreCheckError(state, action);
		case actionTypes.HIGHSCORES_NEW_SCORE_CHECK_END:
			return highscoresNewScoreCheckEnd(state, action);
		case actionTypes.HIGHSCORES_NEW_SCORE_UPDATE:
			return highscoresNewScoreUpdate(state, action);

		case actionTypes.USER_SET_PERSONAL_BESTS:
			return userSetPersonalBests(state, action);
		case actionTypes.USER_NEW_PERSONAL_BEST:
			return userNewPersonalBest(state, action);
		case actionTypes.USER_PATCH_PERSONAL_BEST_START:
			return userPatchPersonalBestStart(state, action);
		case actionTypes.USER_PATCH_PERSONAL_BEST_SUCCESS:
			return userPatchPersonalBestSuccess(state, action);
		case actionTypes.USER_PATCH_PERSONAL_BEST_FAIL:
			return userPatchPersonalBestFail(state, action);
		case actionTypes.USER_GET_PERSONAL_BESTS_FROM_STORAGE:
			return userGetPersonalBestFromStorage(state, action);

		case actionTypes.GAME_PANEL_OPEN:
			return gamePanelOpen(state, action);
		case actionTypes.GAME_PANEL_CLOSE:
			return gamePanelClose(state, action);
		case actionTypes.HIGHSCORES_PANEL_OPEN:
			return highscoresPanelOpen(state, action);
		case actionTypes.HIGHSCORES_PANEL_CLOSE:
			return highscoresPanelClose(state, action);
		case actionTypes.TIMER_START:
			return timerStart(state, action);
		case actionTypes.TIMER_STOP:
			return timerStop(state, action);

		default:
			return state;
	}
};

export default reducer;
