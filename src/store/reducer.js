import * as actionTypes from './actions';
import { updateObject } from '../shared/utility';

const initialState = {
  user: {
    username: 'Anonymous',
    localId: null,
    usersId: null,
    idToken: null,
    personalBests: undefined,
  },
  isLoggedIn: false,
  error: null,
  loading: false,
  authenticating: false,
  isStorageEnabled: undefined
};

const auth_start = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  })
}

const auth_success = (state, action) => {
  return updateObject(state, {
    user: {...action.user},
    isLoggedIn: true,
    error: null,
    loading: false
  })
}

const auth_fail = (state, action) => {
  return updateObject(state, {
    isLoggedIn: false,
    error: action.error,
    loading: false
  })
}

const auth_open_window = (state, action) => {
  return updateObject(state, {
    authenticating: true,
    error: null
  })
}
const auth_close_window = (state, action) => {
  return updateObject(state, {
    authenticating: false
  })
}

const auth_logout = (state, action) => {
  return updateObject(state, {
    user: {
      username: 'Anonymous',
      localId: null,
      usersId: null,
      idToken: null,
      personalBests: undefined,
    },
    isLoggedIn: false
  })
}

const change_username_start = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  })
}

const change_username_success = (state, action) => {
  return updateObject(state, {
    user: updateObject(state.user, {username: action.newUsername}),
    error: true,
    loading: false
  })
}

const change_username_fail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  })
}

const check_storage_enabled = (state, action) => {
  let storage = undefined;
  try {
    storage = localStorage;
    console.log('----storage enabled');
  } catch (error) {
    console.log('----Web Storage Disabled, no data');
  }  
  return updateObject(state, {isStorageEnabled: storage !== undefined})
}


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START: return auth_start(state, action);
    case actionTypes.AUTH_SUCCESS: return auth_success(state, action);
    case actionTypes.AUTH_FAIL: return auth_fail(state, action);
    case actionTypes.AUTH_OPEN_WINDOW: return auth_open_window(state, action);
    case actionTypes.AUTH_CLOSE_WINDOW: return auth_close_window(state, action);
    case actionTypes.AUTH_LOGOUT: return auth_logout(state, action);
    case actionTypes.CHANGE_USERNAME_START: return change_username_start(state, action);
    case actionTypes.CHANGE_USERNAME_SUCCESS: return change_username_success(state, action);
    case actionTypes.CHANGE_USERNAME_FAIL: return change_username_fail(state, action);    
    case actionTypes.CHECK_STORAGE_ENABLED: return check_storage_enabled(state, action);
    default: 
      return state;
  }
}

export default reducer;