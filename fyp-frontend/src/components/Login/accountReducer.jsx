import { ACCOUNT_INITIALISE, LOGIN, LOGOUT } from './actions';

const accountReducer = (state, action) => {
  switch (action.type) {
    case ACCOUNT_INITIALISE: {
      const { isLoggedIn, user, menuItem } = action.payload;
      return {
        ...state,
        isLoggedIn,
        isInitialised: true,
        user,
        menuItem,
      };
    }
    case LOGIN: {
      const { user, menuItem } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        user,
        menuItem,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        menuItem: null,
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default accountReducer;
