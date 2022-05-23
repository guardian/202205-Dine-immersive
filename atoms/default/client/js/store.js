import {createStore, applyMiddleware, combineReducers} from "redux";
import thunk from "redux-thunk";

const initialState = {
    dataLoaded: false,
    sheets: null
};

export const assetsPath = '<%= path %>';

const 
    ACTION_DATA_LOADED = 'action_data_loaded',
    ACTION_SET_SHEETS = 'action_set_sheets'
    ;

const setSheets = (sheets) => {
    return {
        type: ACTION_SET_SHEETS,
        payload: sheets
    };
}
const setDataLoaded = () => {
    return {
        type: ACTION_DATA_LOADED,
        payload: true
    };
}


const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_SET_SHEETS:
            const content = {};
            action.payload.global.forEach(v => {
                content[v.key] = ' TRUE FALSE'.indexOf(v.content) > 0 ? 
                                    (v.content === 'TRUE' ? true : false)
                                    : v.content;
            });
            action.payload.content.forEach(v => {
                content[v.key] = ' TRUE FALSE'.indexOf(v.content) > 0 ? 
                                    (v.content === 'TRUE' ? true : false)
                                    : v.content;
            });

            console.log(content);
            return {...state, sheets: action.payload, content: content };
            break;
        case ACTION_DATA_LOADED:
            return {...state, dataLoaded: true};
        default:
            return state;
    }
}

export const fetchData = (url) => {
    return  (dispatch) => {
        fetch(`${url}?t=${new Date().getTime()}`)
            .then(resp=> resp.json())
            .then((d)=>{
                console.log(d);
                dispatch(setSheets(d.sheets));
                dispatch(setDataLoaded());

            })
            // // .then(setTimeout(this.intro, 2000))
            // .then(this.intro)
            .catch(err => {
                console.log(err);
            });
        }
    
}

export default createStore(rootReducer, applyMiddleware(thunk));