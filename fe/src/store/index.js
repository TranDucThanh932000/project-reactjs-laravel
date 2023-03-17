import { createStore, combineReducers } from 'redux';
import commonReducer from './reducers/commonReducer';

const rootReducer = combineReducers({
    commonReducer: commonReducer
});

const store = createStore(rootReducer);

export default store;
