import * as React from "react";
import { Grid, LinearProgress, TextField, Button } from "@mui/material";
import { Formik } from "formik";
import styles from "./Login.module.scss";
import SendIcon from '@mui/icons-material/Send';
import classNames from "classnames/bind";
import * as Yup from "yup";
import * as authenticationService from '../../services/authenticationService'
import store from "../../store";
import { updateStatusLogin, closeSidebar } from "../../store/actions/commonAction";

const cx = classNames.bind(styles);

const schema = Yup.object().shape({
  account: Yup.string()
    .required("Yêu cầu")
    .min(6, "Ít nhất 6 ký tự")
    .max(16, "Tối đa 16 ký tự"),
  password: Yup.string()
    .required("Yêu cầu")
    .min(6, "Ít nhất 6 ký tự")
    .max(16, "Tối đa 16 ký tự"),
});

const Login = () => {

  React.useEffect(() => {
    store.dispatch(closeSidebar());
  }, [])

  const handleLogin = async (values) => {
    let token = await authenticationService.login({
      ...values
    })
    store.dispatch(updateStatusLogin(true));
    localStorage.setItem('loginToken', token);
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={3}
      className={cx("center")}
    >
      <Formik
        initialValues={{ account: "", password: "" }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await handleLogin(values);
          setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="account"
              name="account"
              label="Tài khoản"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.account}
              error={touched.account && Boolean(errors.account)}
              helperText={touched.account && errors.account}
              className={cx('mb-2')}
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Mật khẩu"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              className={cx('mb-2')}
              type="password"
            />
            {isSubmitting && <LinearProgress></LinearProgress>}
            <div className={cx("text-center")}>
              <Button type="submit" disabled={isSubmitting} variant="outlined" endIcon={<SendIcon />}>
                Đăng nhập
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Grid>
  );
};

export default Login;
