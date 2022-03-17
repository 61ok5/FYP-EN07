export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const MENU_OPEN = '@customization/MENU_OPEN';
export const MENU_TYPE = '@customization/MENU_TYPE';
export const THEME_LOCALE = '@customization/THEME_LOCALE';
export const THEME_RTL = '@customization/THEME_RTL';
export const SNACKBAR_OPEN = '@snackbar/SNACKBAR_OPEN';
export const ACCOUNT_INITIALISE = 'ACCOUNT_INITIALISE';
export const FIREBASE_STATE_CHANGED = 'FIREBASE_STATE_CHANGED';

export const SNACKBAR_ERROR = {
  type: SNACKBAR_OPEN,
  open: true,
  variant: 'alert',
  alertSeverity: 'error',
  anchorOrigin: { vertical: 'top', horizontal: 'center' },
  message: 'Unknown error occurred. Please try again.',
  autoHideDuration: 5,
  transitionDuration: { enter: 0.5 },
};

export const SNACKBAR_INFO = {
  type: SNACKBAR_OPEN,
  open: true,
  variant: 'alert',
  alertSeverity: 'info',
  anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
  autoHideDuration: 5,
  transitionDuration: { enter: 0.5 },
};

export const SNACKBAR_SUCCESS = {
  type: SNACKBAR_OPEN,
  open: true,
  variant: 'alert',
  alertSeverity: 'success',
  anchorOrigin: { vertical: 'top', horizontal: 'center' },
  message: 'Success!',
  autoHideDuration: 5,
  transitionDuration: { enter: 0.5 },
};

export const SNACKBAR_WARNING = {
  type: SNACKBAR_OPEN,
  open: true,
  variant: 'alert',
  alertSeverity: 'warning',
  anchorOrigin: { vertical: 'top', horizontal: 'center' },
  message: 'Warning!',
  autoHideDuration: 5,
  transitionDuration: { enter: 0.5 },
};
