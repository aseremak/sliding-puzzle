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
	isLoggedIn: false,
	error: null,
	loadingAuth: false,
	loadingHighscores: false,
	loadingPersonalBests: false,
	authenticating: false,
	isStorageEnabled: undefined,
	highscores: null,
	thunk: null
};

const AVAILABLE_GAMES = [ '3x3+', '4x4+', '5x5+', '3x3', '4x4', '5x5' ];

const auth_start = (state, action) => {
	return updateObject(state, {
		error: null,
		loadingAuth: true
	});
};

const auth_success = (state, action) => {
	return updateObject(state, {
		user: { ...action.user },
		isLoggedIn: true,
		error: null,
		loadingAuth: false
	});
};

const auth_fail = (state, action) => {
	return updateObject(state, {
		isLoggedIn: false,
		error: action.error,
		loadingAuth: false
	});
};

const auth_open_window = (state, action) => {
	return updateObject(state, {
		authenticating: true,
		error: null
	});
};
const auth_close_window = (state, action) => {
	return updateObject(state, {
		authenticating: false
	});
};

const auth_logout = (state, action) => {
	return updateObject(state, {
		user: {
			username: 'Anonymous',
			anonymous: true,
			localId: null,
			usersId: null,
			idToken: null,
			personalBests: undefined
		},
		isLoggedIn: false
	});
};

const change_username_start = (state, action) => {
	return updateObject(state, {
		error: null,
		loadingAuth: true
	});
};

const change_username_success = (state, action) => {
	return updateObject(state, {
		user: updateObject(state.user, { username: action.newUsername }),
		error: true,
		loadingAuth: false
	});
};

const change_username_fail = (state, action) => {
	return updateObject(state, {
		error: action.error,
		loadingAuth: false
	});
};

const highscores_get_start = (state, action) => {
	return updateObject(state, {
		highscores: null,
		error: null,
		loadingHighscores: true
	});
};

const highscores_get_success = (state, action) => {
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
	console.log(action.highscores, highscores);
	return updateObject(state, {
		highscores: highscores,
		loadingHighscores: false
	});
};

const highscores_get_fail = (state, action) => {
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

const user_get_personal_best_from_storage = (state, action) => {
	return updateObject(state, {
		user: updateObject(state.user, {
			personalBests: {}
		})
	});
};

const user_set_personal_bests = (state, action) => {
	return updateObject(state, {
		user: updateObject(state.user, {
			personalBests: action.personalBests
		})
	});
};

const user_new_personal_best = (state, action) => {
	return updateObject(state, {
		user: updateObject(state.user, {
			personalBests: updateObject(state.user.personalBests, {
				[action.gameType]: action.time
			})
		})
	});
};

const user_patch_personal_best_start = (state, action) => {
	return updateObject(state, {
		error: null,
		loadingPersonalBests: true
	});
};

const user_patch_personal_best_success = (state, action) => {
	return updateObject(state, {
		error: null,
		loadingPersonalBests: false
	});
};

const user_patch_personal_best_fail = (state, action) => {
	return updateObject(state, {
		error: action.error,
		loadingPersonalBests: false
	});
};

const highscores_compare_new_score_start = (state, action) => {
	return state;
}

const highscores_compare_new_score_end = (state, action) => {
	return state;
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.AUTH_START:
			return auth_start(state, action);
		case actionTypes.AUTH_SUCCESS:
			return auth_success(state, action);
		case actionTypes.AUTH_FAIL:
			return auth_fail(state, action);
		case actionTypes.AUTH_OPEN_WINDOW:
			return auth_open_window(state, action);
		case actionTypes.AUTH_CLOSE_WINDOW:
			return auth_close_window(state, action);
		case actionTypes.AUTH_LOGOUT:
			return auth_logout(state, action);
		case actionTypes.CHANGE_USERNAME_START:
			return change_username_start(state, action);
		case actionTypes.CHANGE_USERNAME_SUCCESS:
			return change_username_success(state, action);
		case actionTypes.CHANGE_USERNAME_FAIL:
			return change_username_fail(state, action);
		case actionTypes.HIGHSCORES_GET_START:
			return highscores_get_start(state, action);
		case actionTypes.HIGHSCORES_GET_SUCCESS:
			return highscores_get_success(state, action);
		case actionTypes.HIGHSCORES_GET_FAIL:
			return highscores_get_fail(state, action);

		case actionTypes.HIGHSCORES_COMPARE_NEW_SCORE_START:
			return highscores_compare_new_score_start(state, action);
		case actionTypes.HIGHSCORES_COMPARE_NEW_SCORE_END:
			return highscores_compare_new_score_end(state, action);

		case actionTypes.USER_SET_PERSONAL_BESTS:
			return user_set_personal_bests(state, action);
		case actionTypes.USER_NEW_PERSONAL_BEST:
			return user_new_personal_best(state, action);
		case actionTypes.USER_PATCH_PERSONAL_BEST_START:
			return user_patch_personal_best_start(state, action);
		case actionTypes.USER_PATCH_PERSONAL_BEST_SUCCESS:
			return user_patch_personal_best_success(state, action);
		case actionTypes.USER_PATCH_PERSONAL_BEST_FAIL:
			return user_patch_personal_best_fail(state, action);
		case actionTypes.USER_GET_PERSONAL_BESTS_FROM_STORAGE:
			return user_get_personal_best_from_storage(state, action);

		case 'THUNK_START': return (state, action) => { updateObject(state, {thunk: 777})}

		default:
			return state;
	}
};

export default reducer;
