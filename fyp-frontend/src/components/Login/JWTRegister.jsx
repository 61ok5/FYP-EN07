/* eslint-disable react/jsx-props-no-spreading */
import { Box, Button, TextField } from '@mui/material';
import clsx from 'clsx';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import useAuth from './useAuth';
import useScriptRef from './useScriptRef';

const JWTLogin = ({ className, ...rest }) => {
//   const { login } = useAuth();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        confirmpw: '',
        nickname: '',
        tel: '',
        role_id: '2',
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().min(8).required('Password is required')
          .matches(/[a-z]/, 'Password require lowercase')
          .matches(/[A-Z]/, 'Password require uppercase')
          .matches(/[0-9]/, 'Password require digit')
          .matches(/[\W_]/, 'Password require symbol'),
        confirmpw: Yup.string().oneOf([Yup.ref('password'), null, Yup.ref('password') == null, Yup.ref('password').length === 0], 'Confirm password does not match').when('password', { is: (password) => (password != null && password.length > 0), then: Yup.string().required('Password confirm required') }),
        nickname: Yup.string().max(20).required('Nickname is required'),
        tel: Yup.string().matches(/^([0-9]{8})$/, 'Phone number is not valid').required('Phone number is required'),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          //  await login(values.email, values.password);
          const response = await axios.post('https://fyp-en07.hkrnd.com/api/user/create', { email: values.email, password: values.password, nickname: values.nickname, tel: values.tel, role_id: values.role_id });
          if (response.data.status === 'ok') {
            setStatus({ success: true });
            setSubmitting(false);
            navigate(-1);
          }
        } catch (err) {
          console.error(err);
          if (scriptedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} className={clsx(className)} {...rest}>
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            autoFocus
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.nickname && errors.nickname)}
            name="nickname"
            fullWidth
            autoFocus
            helperText={touched.nickname && errors.nickname}
            label="Nickname"
            margin="normal"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.nickname}
            // InputProps={editable.Props}
            // variant={editable.variant}
          />
          <TextField
            error={Boolean(touched.tel && errors.tel)}
            name="tel"
            fullWidth
            autoFocus
            helperText={touched.tel && errors.tel}
            label="Phone Number"
            margin="normal"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.tel}
            // InputProps={editable.Props}
            // variant={editable.variant}
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.confirmpw && errors.confirmpw)}
            fullWidth
            helperText={touched.confirmpw && errors.confirmpw}
            label="Confirm Password"
            margin="normal"
            name="confirmpw"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.confirmpw}
            variant="outlined"
          />
          <Box mt={2}>
            <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
              Register
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
