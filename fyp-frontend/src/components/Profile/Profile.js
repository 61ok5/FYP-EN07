/* eslint-disable react/jsx-props-no-spreading */
/* eslint no-unused-vars: 0 */
/* eslint no-shadow: 0 */
/* eslint camelcase: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint react/require-default-props: 0 */
/* eslint react/jsx-fragments: 0 */
/* eslint arrow-body-style: 0 */

import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid, Tab, Tabs, TextField,
  Typography,
} from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';
import makeStyles from '@mui/styles/makeStyles';
import axios from 'axios';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
// import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import useAuth from '../Login/useAuth';
// import Alert from '../../../component/Alert';
// import Breadcrumb from '../../../component/Breadcrumb';
import * as actionTypes from '../Login/actions';
// import API from '../../../utils/api';
// import Validation from '../../../utils/validation';
const moment = require('moment-timezone');

const useStyles = makeStyles((theme) => ({
  accounttab: {
    marginBottom: '24px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    '& button': {
      minWidth: '100px',
      minHeight: 'auto',
      '& > span': {
        flexDirection: 'row',
        '& > svg': {
          marginRight: '5px',
          marginBottom: '0 !important',
        },
      },
    },
  },
  accountavtar: {
    width: '100px',
    height: '100px',
    margin: '0 auto',
  },
  accountcontent: {
    textAlign: 'center',
  },
  opacity50: {
    opacity: '.5',
  },
  cardtitle: {
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    '& > svg': {
      marginRight: '8px',
    },
  },
  usertable: {
    '& td': {
      borderBottom: 'none',
    },
  },
  devicename: {
    '& >span': {
      fontSize: '90%',
      fontWeight: '400',
    },
  },
  devicestate: {
    display: 'inline-flex',
    alignItems: 'center',
    '& >svg': {
      width: '0.7em',
      height: '0.7em',
      marginRight: '5px',
    },
  },
  textactive: {
    color: theme.palette.success.main,
  },
  textmuted: {
    color: theme.palette.grey[400],
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  list_row: {
    padding: '1rem',
    marginBottom: '1rem',
    '&:hover': {
      backgroundColor: 'rgba(220, 202, 135, 0.2)',
    },
  },
  list_content: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box p={0}>{children}</Box>}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Profile = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  // const intl = useIntl();

  // User data
  const [meData, setMeData] = useState({
    email: '',
    tel: '',
    role: '',
    nickname: '',
    submit: null,
  });

  const initAccountDetails = async () => {
    const response = await axios.get('https://fyp-en07.hkrnd.com/api/user/me');
    setMeData(response.data);
  };

  const [list, setList] = useState([]);

  const initList = async () => {
    const response = await axios.get('https://fyp-en07.hkrnd.com/api/course/list/info/all');
    setList(response.data);
  };

  useEffect(() => {
    initAccountDetails();
    initList();
  }, []);

  useEffect(() => {
    console.log(list);
  }, [list]);

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [editable, setEditable] = useState({
    Props: {
      readOnly: true,
    },
    variant: 'filled',
    showEditButtons: false,
  });

  const setAccountDetailsEditable = (is_editable) => {
    if (is_editable) {
      setEditable({
        Props: {
          readOnly: false,
        },
        variant: 'outlined',
        showEditButtons: true,
      });
    } else {
      setEditable({
        Props: {
          readOnly: true,
        },
        variant: 'filled',
        showEditButtons: false,
      });
    }
  };

  const doneEditAccountDetails = () => {
    setAccountDetailsEditable(false);
    initAccountDetails();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Grid container style={{ maxHeight: '92vh' }}>
      <Grid item xs={12} sm={7}>
        <Typography variant="h2" style={{ margin: '1rem' }}>Purchased course list</Typography>
        <div style={{ overflow: 'auto', overflowWrap: 'normal', maxHeight: '92vh' }}>
          {list.map((course, index) => {
            return (
              <Link to={`/course/${course.course_id}`}>
                <div className={classes.list_row} key={course.title}>
                  <div className={classes.list_content}>
                    <div style={{ fontSize: '1.25rem', width: '100rem', flexWrap: 'wrap', marginRight: '1.5rem' }}>{course.title}</div>
                    <div style={{ fontSize: '0.5rem', width: '25rem', flexWrap: 'wrap', marginRight: '0.5rem' }}>{moment(`${course.updated_at}`).tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:MM:SS')}</div>
                    <div style={{ fontSize: '0.25rem', color: '#666666', width: '25rem', flexWrap: 'wrap', marginRight: '0.5rem' }}>{(course.i_category !== null && (course.p_category || course.ps_category)) ? `${course.i_category} - ` : ''}{(course.p_category && course.p_category) ? `${course.p_category} - ` : ''}{course.ps_category}</div>
                    <div style={{ fontSize: '0.5rem', width: '15rem', flexWrap: 'wrap' }}>{course.price}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Grid>
      <Grid item xs={12} sm={5}>
        <Formik
          initialValues={{
            oldPassword: '',
            password: '',
            confirmPassword: '',
            submit: null,
          }}
          validationSchema={Yup.object().shape({
            oldPassword: Yup.string().required('Old Password Required'),
            password: Yup.string().min(8).required('Password is required')
              .matches(/[a-z]/, 'Password require lowercase')
              .matches(/[A-Z]/, 'Password require uppercase')
              .matches(/[0-9]/, 'Password require digit')
              .matches(/[\W_]/, 'Password require symbol'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null, Yup.ref('password') == null, Yup.ref('password').length === 0], 'Confirm password does not match').when('password', { is: (password) => (password != null && password.length > 0), then: Yup.string().required('Password confirm required') }),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
            try {
              await axios.post('https://fyp-en07.hkrnd.com/api/user/changePassword/', { old_password: values.oldPassword, new_password: values.password, confirm_password: values.confirmPassword });
              resetForm({});
              dispatch({ ...actionTypes.SNACKBAR_SUCCESS, message: 'Password Changed!' });
            } catch (err) {
              dispatch({ ...actionTypes.SNACKBAR_ERROR, message: 'Unknown Error!' });
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader
                      title={<Typography component="div" className="card-header">Account Profile</Typography>}
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            InputProps={{ readOnly: true }}
                            name="email"
                            fullWidth
                            label="Email"
                            variant="standard"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={meData.email}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            InputProps={{ readOnly: true }}
                            name="nickname"
                            fullWidth
                            label="Nickname"
                            variant="standard"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={meData.nickname}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            InputProps={{ readOnly: true }}
                            name="tel"
                            fullWidth
                            label="Tel"
                            variant="standard"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={meData.tel}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            InputProps={{ readOnly: true }}
                            name="role"
                            fullWidth
                            label="Role"
                            variant="standard"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={meData.role}
                          />
                        </Grid>
                        <CardHeader
                          title={<Typography component="div" className="card-header">Change Password</Typography>}
                        />
                        <Grid item xs={12}>
                          <TextField
                            type="password"
                            name="oldPassword"
                            fullWidth
                            label="Current password"
                            variant="outlined"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.oldPassword}
                            error={Boolean(touched.oldPassword && errors.oldPassword)}
                            helperText={touched.oldPassword && errors.oldPassword}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            type="password"
                            name="password"
                            fullWidth
                            label="New Password"
                            variant="outlined"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            error={Boolean(touched.password && errors.password)}
                            helperText={(touched.password && errors.password)?.replace('Old Password Required', 'New Password Required')}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            type="password"
                            name="confirmPassword"
                            fullWidth
                            label="Re-enter New Password"
                            variant="outlined"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.confirmPassword}
                            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                            helperText={touched.confirmPassword && errors.confirmPassword}
                          />
                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Button variant="contained" color="info" type="submit">
                            Change Password
                          </Button>
                          <Button href="/" variant="contained" onClick={handleLogout} color="error" type="button">
                            Logout
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default Profile;
