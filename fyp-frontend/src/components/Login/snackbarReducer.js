import * as actionTypes from './actions';

const initialState = {
  action: false,
  open: false,
  title: '',
  message: '',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right',
  },
  variant: 'default',
  alertSeverity: 'success',
  autoHideDuration: null,
  transition: 'Fade',
  transitionDuration: {},
};

const snackbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SNACKBAR_OPEN:
      return {
        ...state,
        action: !state.action,
        open: action.open ? action.open : initialState.open,
        message: action.message ? action.message : initialState.message,
        anchorOrigin: action.anchorOrigin ? action.anchorOrigin : initialState.anchorOrigin,
        variant: action.variant ? action.variant : initialState.variant,
        alertSeverity: action.alertSeverity ? action.alertSeverity : initialState.alertSeverity,
        autoHideDuration: action.autoHideDuration ? action.autoHideDuration : initialState.autoHideDuration,
        transition: action.transition ? action.transition : initialState.transition,
        transitionDuration: action.transitionDuration ? action.transitionDuration : initialState.transitionDuration,
      };
    default:
      return state;
  }
};

export default snackbarReducer;
