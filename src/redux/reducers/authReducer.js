import { SET_AUTH, CLEAR_AUTH } from '../actions/authActions';

const initialState = {
  user: null,
  token: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_AUTH:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case CLEAR_AUTH:
      return initialState;
    default:
      return state;
  }
}