import { combineReducers, createStore } from 'redux';

import DataReducer from './DataReducer';

const AppReducers = combineReducers({
    DataReducer,
});

const rootReducer = (state, action) => {
    return AppReducers(state, action);
}

let store = createStore(rootReducer);

export default store;