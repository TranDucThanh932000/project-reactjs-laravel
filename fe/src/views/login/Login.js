import * as React from "react";
import { Grid, LinearProgress, TextField, Button } from "@mui/material";
import { Formik } from "formik";
import styles from "./Login.module.scss";
import SendIcon from '@mui/icons-material/Send';
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

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
  const history = useNavigate();

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
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
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
