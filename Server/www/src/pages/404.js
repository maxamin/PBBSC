import Head from 'next/head';
import NextLink from 'next/link';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { useCallback,useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Box,
  Button,
  Container,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import {signIn} from 'next-auth/react';
import SettingsContext from 'src/settings';
import crypto from 'crypto';
import Cookies from 'js-cookie';

const Page = () => {
  const router = useRouter();
  const { secret } = router.query;

  const [isValid, setIsValid] = useState(false);

  const hashPassword = (password) => {
    const sha256Hash = crypto.createHash('sha256');
    sha256Hash.update(password);
    return sha256Hash.digest('hex');
  };

  const [method, setMethod] = useState('email');
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .max(255)
        .required('Username is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        let username = values.email;
        let password = values.password;
        const response =  await signIn('credentials', {
          redirect: false,
          username,
          password,
        });

        if (response.error){
          console.log(response.error)
        } else {
          SettingsContext.password = hashPassword(values.password);
          Cookies.set('pwd', hashPassword(values.password), {expires: 7})
          router.push('/');
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    fetch('/api/auth/login?secret=' + secret)
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Login page content goes here') {
          setIsValid(true)
              } else {
                setIsValid(false)
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }, [router]);
      
        return (
          <div>
            {(isValid === null || !isValid) ? (
                  <>
                    <Head>
                      <title>
                        404
                      </title>
                    </Head>
                    <Box
                      component="main"
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexGrow: 1,
                        minHeight: '100%'
                      }}
                    >
                      <Container maxWidth="md">
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <Box
                            sx={{
                              mb: 3,
                              textAlign: 'center'
                            }}
                          >
                            <img
                              alt="Under development"
                              src="/assets/errors/error-404.png"
                              style={{
                                display: 'inline-block',
                                maxWidth: '100%',
                                width: 400
                              }}
                            />
                          </Box>
                          <Typography
                            align="center"
                            sx={{ mb: 3 }}
                            variant="h3"
                          >
                            404: The page you are looking for isn’t here
                          </Typography>
                        </Box>
                      </Container>
                    </Box>
                  </>
            ) : 
            <>
            <Head>
              <title>
                Login
              </title>
            </Head>
            <Box
              sx={{
                backgroundColor: 'background.paper',
                flex: '1 1 auto',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  maxWidth: 550,
                  px: 3,
                  py: '100px',
                  width: '100%'
                }}
              >
                <div>
                  <Stack
                    spacing={1}
                    sx={{ mb: 3 }}
                  >
                    <Typography variant="h4">
                      Login
                    </Typography>
                  </Stack>
                    <form
                      noValidate
                      onSubmit={formik.handleSubmit}
                    >
                      <Stack spacing={3}>
                        <TextField
                          error={!!(formik.touched.email && formik.errors.email)}
                          fullWidth
                          helperText={formik.touched.email && formik.errors.email}
                          label="Username"
                          name="email"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="email"
                          value={formik.values.email}
                        />
                        <TextField
                          error={!!(formik.touched.password && formik.errors.password)}
                          fullWidth
                          helperText={formik.touched.password && formik.errors.password}
                          label="Password"
                          name="password"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="password"
                          value={formik.values.password}
                        />
                      </Stack>
                      {formik.errors.submit && (
                        <Typography
                          color="error"
                          sx={{ mt: 3 }}
                          variant="body2"
                        >
                          {formik.errors.submit}
                        </Typography>
                      )}
                      <Button
                        fullWidth
                        size="large"
                        sx={{ mt: 3 }}
                        type="submit"
                        variant="contained"
                      >
                        Continue
                      </Button>
                    </form>
                </div>
              </Box>
            </Box>
          </> }
          </div>
        );
      
      };

export default Page;
