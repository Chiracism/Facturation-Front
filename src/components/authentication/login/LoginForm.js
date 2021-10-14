import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import SweetAlert from 'react-bootstrap-sweetalert';

// Material
import { Stack, TextField, IconButton, InputAdornment } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import axios from 'axios';

import './LoginForm.css';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email doit être valide').required('Email est réquis'),
    password: Yup.string().required('Password est réquis')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      setLoading(true);
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/user/auth/`, {
          email: values.email,
          password: values.password
        })
        .then((token) => {
          localStorage.setItem('lmc_token', JSON.stringify(token.data.token));
          setLoading(false);
          navigate('/dashboard', { replace: true });
        })
        .catch(() => {
          setLoading(false);
          setShowAlert(true);
        });
    }
  });

  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const onConfirm = () => {
    setShowAlert(false);
  };

  return (
    <>
      {showAlert ? (
        <SweetAlert
          title="Erreur"
          type="error"
          btnSize="lg"
          confirmBtnBsStyle="info"
          onConfirm={() => onConfirm()}
        >
          Vos identifiants ne sont pas corrects !
        </SweetAlert>
      ) : null}
      <FormikProvider value={formik}>
        <Form autoComplete="true" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              autoComplete="username"
              type="email"
              label="Email"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
          </Stack>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={loading}
            style={{ background: 'blue' }}
            sx={{ mt: 6 }}
          >
            Login
          </LoadingButton>
        </Form>
      </FormikProvider>
    </>
  );
}
