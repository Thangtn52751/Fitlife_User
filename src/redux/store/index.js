import { createStore, combineReducers } from 'redux';
import authReducer from '../reducers/authReducer';
import { stepReducer } from '../reducers/stepReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  step: stepReducer,
});

const store = createStore(rootReducer);

export default store;