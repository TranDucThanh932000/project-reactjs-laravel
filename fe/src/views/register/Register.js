import * as React from "react";
import { Grid, LinearProgress, TextField, Button } from "@mui/material";
import { Formik } from "formik";
import styles from "./Register.module.scss";
import SendIcon from "@mui/icons-material/Send";
import classNames from "classnames/bind";
import * as Yup from "yup";
import * as authenticationService from "../../services/authenticationService";
import store from "../../store";
import {
  updateStatusLogin,
  closeSidebar,
  openSidebar,
} from "../../store/actions/commonAction";
import { Link, useNavigate } from "react-router-dom";
import LinkMui from "@mui/material/Link";

const cx = classNames.bind(styles);

const schema = Yup.object().shape({
  name: Yup.string()
    .required("Yêu cầu")
    .min(6, "Ít nhất 6 ký tự")
    .max(32, "Tối đa 32 ký tự"),
  email: Yup.string().required("Yêu cầu").email("Chưa đúng định dạng email"),
  account: Yup.string()
    .required("Yêu cầu")
    .min(6, "Ít nhất 6 ký tự")
    .max(16, "Tối đa 16 ký tự"),
  password: Yup.string()
    .required("Yêu cầu")
    .min(6, "Ít nhất 6 ký tự")
    .max(16, "Tối đa 16 ký tự"),
    password_confirmation: Yup.string()
    .required("Yêu cầu")
    .oneOf([Yup.ref("password"), null], "Mật khẩu chưa khớp"),
});

const Register = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    store.dispatch(closeSidebar());
  }, []);

  const handleRegister = async (values) => {
    let token = await authenticationService.register(values);
    console.log(token)

    store.dispatch(updateStatusLogin(true));
    store.dispatch(openSidebar(true));
    localStorage.setItem('loginToken', token.token);
    navigate('/');
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={3}
      className={cx("center", "max400px")}
    >
      <Formik
        initialValues={{ account: "", password: "", password_confirmation: "", name: "", email: "" }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await handleRegister(values);
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
              id="name"
              name="name"
              label="Họ và tên"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              className={cx("mb-2")}
            />
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              className={cx("mb-2")}
            />
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
              className={cx("mb-2")}
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
              className={cx("mb-2")}
              type="password"
            />
            <TextField
              fullWidth
              id="password_confirmation"
              name="password_confirmation"
              label="Nhập lại mật khẩu"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password_confirmation}
              error={touched.password_confirmation && Boolean(errors.password_confirmation)}
              helperText={touched.password_confirmation && errors.password_confirmation}
              className={cx("mb-2")}
              type="password"
            />
            {isSubmitting && <LinearProgress></LinearProgress>}
            <div className={cx("text-center")}>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="outlined"
                endIcon={<SendIcon />}
              >
                Đăng ký
              </Button>
            </div>
            <Link to={"/login"}>
              <LinkMui component="button">Đăng nhập</LinkMui>
            </Link>
            <br/>
            <Link to={"/"}>
              <LinkMui component="button">Trở về trang chủ</LinkMui>
            </Link>
          </form>
        )}
      </Formik>
    </Grid>
  );
};

export default Register;
