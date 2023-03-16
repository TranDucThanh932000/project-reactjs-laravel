import * as React from "react";
import { Button, Grid, LinearProgress } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import styles from './Login.module.scss'
import classNames from 'classnames/bind';
import { redirect } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));


const cx = classNames.bind(styles);

const Login = () => {
  return (
    <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3}>
      <Formik
        initialValues={{
          account: "",
          password: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.account) {
            errors.account = "Yêu cầu";
          } else if (!/^[A-Za-z0-9]{6,16}$/i.test(values.account)) {
            errors.account = "Tài khoản không hợp lệ";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
        //   setTimeout(() => {
        //     setSubmitting(false);
        //     alert(JSON.stringify(values, null, 2));
        //   }, 500);
           redirect('/login1')
        }}
      >
        {({ submitForm, isSubmitting }) => (
          <Grid item xs={6}>
            <Item>
              <Form>
                <Field
                  component={TextField}
                  name="account"
                  type="text"
                  label="Tài khoản"
                  className={cx('mb-2')}
                />
                <br />
                <Field
                  component={TextField}
                  type="password"
                  label="Mật khẩu"
                  name="password"
                  className={cx('mb-2')}
                />
                {isSubmitting && <LinearProgress />}
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                  Đăng nhập
                </Button>
              </Form>
            </Item>
          </Grid>
        )}
      </Formik>
    </Grid>
  );
};

export default Login;
