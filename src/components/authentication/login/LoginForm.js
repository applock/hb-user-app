import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  MenuItem
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { BACKEND_HOST } from '../../../configs/constants';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [manualLoginType, setLoginType] = useState('mobile');

  const handleLoginTypeChange = (event) => {
    setLoginType(event.target.value);
  };

  const LoginSchema = Yup.object().shape({
    email:
      manualLoginType === 'email'
        ? Yup.string().email('Email must be a valid email address').required('Email is required')
        : Yup.string().required('Mobile is required').length(10, 'Mobile must be of 10 digits'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      console.log('Starting login process..');

      const loginReqPayload = {
        [manualLoginType]: formik.values.email,
        password: formik.values.password,
        hashedPassword: 0
      };
      // const loginUrl = `${process.env.BACKEND_HOST}hb/login/${manualLoginType}`;
      const loginUrl = `${BACKEND_HOST}hb/login/${manualLoginType}`;
      console.log(
        `Login Request: Url - ${loginUrl} | Payload - ${JSON.stringify(loginReqPayload)}`
      );

      // Calling backend
      fetch(loginUrl, {
        method: 'POST',
        body: JSON.stringify(loginReqPayload),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
        .then((response) => response.json())
        // Displaying results to console
        .then((json) => console.log(`LOGIN RESPONSE - ${JSON.stringify(json)}`))
        .then(navigate('/dashboard', { replace: true }))
        .catch((err) => {
          // code to handle request errors
          console.log(`Login errors - ${JSON.stringify(err)}`);
          navigate('/login', { replace: true });
        });
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;
  const manualLoginTypes = [
    {
      value: 'email',
      label: 'Email Id'
    },
    {
      value: 'mobile',
      label: 'Mobile Number'
    }
  ];
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            id="standard-select-logintype"
            select
            label="Select"
            value={manualLoginType}
            onChange={handleLoginTypeChange}
            helperText="Please select your login type"
          >
            {manualLoginTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            autoComplete="username"
            type={manualLoginType === 'email' ? 'email' : 'number'}
            label={manualLoginType === 'email' ? 'Email address' : 'Mobile'}
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

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
