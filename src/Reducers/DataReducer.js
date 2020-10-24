const initialState = {
    isUpdated: false,
    type:''
};

const DataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'DATA_CHANGED':
            return action.data;
        default:
            return state;
    }
};

export default DataReducer;