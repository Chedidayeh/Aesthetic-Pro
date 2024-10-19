
// Action Types

export const SAVE_REDIRECT_URL = 'SAVE_REDIRECT_URL';
export const SAVE_SESSION_ID = 'SAVE_SESSION_ID'


// Action Creators

  export const saveRedirectUrl = (url : string | null) => ({
    type: SAVE_REDIRECT_URL,
    payload: url,
  });

  export const saveSessionId = (id : string | null) => ({
    type: SAVE_SESSION_ID,
    payload: id,
  });









