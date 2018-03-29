import axios from 'axios';

import * as actionTypes from './actionTypes';

const authStart = () => ({
  type: actionTypes.AUTH_START
});

const authSuccess = (idToken, userId) => ({
  type: actionTypes.AUTH_SUCCESS,
  idToken,
  userId
});

const authFail = error => ({
  type: actionTypes.AUTH_FAIL,
  error
});

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('expirationDate');
  return {
    type: actionTypes.AUTH_LOGOUT
  };
  
};

const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email,
      password,
      returnSecureToken: true
    };
    let url =
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBQID1NdREoOPpd8-Si4TWMMlX9sI4LbTY';
    if (!isSignUp) {
      url =
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBQID1NdREoOPpd8-Si4TWMMlX9sI4LbTY';
    }

    axios
      .post(url, authData)
      .then(response => {
        // console.log(response.data);
        const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
        localStorage.setItem('token', response.data.idToken);
        localStorage.setItem('userId', response.data.localId)
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(err => {
        // console.log(err);
        dispatch(authFail(err.response.data.error));
      });
  };
};

export const setAuthRedirectPath = (path) => ({
  type: actionTypes.SET_AUTH_REDIRECT_PATH,
  path
});

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
      }
      
    }
  }
}
