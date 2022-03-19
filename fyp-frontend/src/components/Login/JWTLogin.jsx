/* eslint-disable react/jsx-props-no-spreading */
import { Box, Button, TextField } from '@mui/material';
import clsx from 'clsx';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import useScriptRef from './useScriptRef';

const JWTLogin = ({ className, ...rest }) => {
  const { login } = useAuth();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required'),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await login(values.email, values.password);
          if (scriptedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
            navigate('/');
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
          <Box mt={2}>
            <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
              Sign In
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
