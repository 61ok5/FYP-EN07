import config from './config';
import * as actionTypes from './actions';

export const initialState = {
  isOpen: config.home_menu_item_id, // for active default menu
  locale: config.i18n,
  navType: config.theme,
  rtlLayout: config.rtlLayout,
};

const customizationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.MENU_OPEN:
      return {
        ...state,
        isOpen: action.isOpen,
      };
    case actionTypes.MENU_TYPE:
      return {
        ...state,
        navType: action.navType,
      };
    case actionTypes.THEME_LOCALE:
      return {
        ...state,
        locale: action.locale,
      };
    case actionTypes.THEME_RTL:
      return {
        ...state,
        rtlLayout: action.rtlLayout,
      };
    default:
      return state;
  }
};

export default customizationReducer;
