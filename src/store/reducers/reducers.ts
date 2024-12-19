import {  SAVE_REDIRECT_URL, SAVE_SESSION_ID } from "../actions/action";


const initialState = {
  url: null,
  id : null,
};

export type RootState = ReturnType<typeof rootReducer>;


const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SAVE_REDIRECT_URL:
      return {
        ...state,
        url: action.payload,
      };
    case SAVE_SESSION_ID : 
    return {
      ...state,
      id : action.payload
    }
    default:
      return state;
  }
};

export default rootReducer;




