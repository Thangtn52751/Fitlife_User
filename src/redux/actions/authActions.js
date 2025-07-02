export const SET_AUTH   = 'AUTH/SET_AUTH';
export const CLEAR_AUTH = 'AUTH/CLEAR_AUTH';

export const setAuth = (user, token) => ({
  type: SET_AUTH,
  payload: { user, token },
});

export const clearAuth = () => ({
  type: CLEAR_AUTH,
});