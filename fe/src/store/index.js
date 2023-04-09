import { createStore, combineReducers } from 'redux';
import commonReducer from './reducers/commonReducer';
import chattingReducer from './reducers/chattingReducer';

const rootReducer = combineReducers({
    commonReducer: commonReducer,
    chattingReducer: chattingReducer
});

const store = createStore(rootReducer);

export default store;
