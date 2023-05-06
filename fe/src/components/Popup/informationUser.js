import * as React from "react";
import {
  LinearProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Formik } from "formik";
import * as Yup from "yup";
import classNames from "classnames/bind";
import styles from "./scss/informationUser.module.scss";
import * as userService from "../../services/userService";
import { Box } from "@mui/system";
import { updateCurrentUser, updateTextAlert } from "../../store/actions/commonAction";
import store from "../../store";
import { connect } from "react-redux";

const cx = classNames.bind(styles);

const mapStateToProps = (state) => {
  return {
    currentUser: state.commonReducer.currentUser,
  };
};

const schema = Yup.object().shape({
  name: Yup.string()
    .required("Yêu cầu")
    .min(6, "Ít nhất 6 ký tự")
    .max(32, "Tối đa 32 ký tự"),
  email: Yup.string().required("Yêu cầu").email("Chưa đúng định dạng email"),
  password: Yup.string().min(6, "Ít nhất 6 ký tự").max(16, "Tối đa 16 ký tự"),
});

const InformationUser = (props) => {
  const [open, setOpen] = React.useState(false);
  const fileUpload = React.useRef(null);
  const [avatar, setAvatar] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeInfor = async (values) => {
    await userService.changeInfor(values).then((res) => {
      store.dispatch(updateCurrentUser({
        ...props.currentUser, 
        name: values.name,
        email: values.email,
        avatar: res.avatar
      }));
      props.handleMenuClose();
      handleClose();
    });
  };

  const handleOpenUploadImg = async () => {
    fileUpload.current.click();
  };

  const handleChangeFile = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage.size > 10485760 / 2) {
      store.dispatch(updateTextAlert("File không được lớn quá 5MB"));
      setTimeout(() => {
        store.dispatch(updateTextAlert(""));
      }, 3000);
      return;
    }
    selectedImage.url = URL.createObjectURL(selectedImage);
    setAvatar(selectedImage);
  };

  React.useEffect(() => {
    setAvatar(`https://docs.google.com/uc?id=${props.currentUser.avatar}`);
  }, [props.currentUser, open]);

  return (
    <div>
      <MenuItem onClick={handleClickOpen}>Thông tin cá nhân</MenuItem>
      {open && (
        <Formik
          initialValues={{
            name: props.currentUser.name,
            email: props.currentUser.email,
            password: "",
          }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            values.images = typeof avatar == "object" ? avatar : [null];
            values.id = props.currentUser.id;
            await handleChangeInfor(values)
            setSubmitting(false);
            store.dispatch(updateTextAlert("Lưu thông tin thành công"));
            setTimeout(() => {
              store.dispatch(updateTextAlert(""));
            }, 3000);
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
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Thông tin cá nhân</DialogTitle>
                <DialogContent>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Tên"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    className={cx("mb-2", "mt-2")}
                    type="text"
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
                    type="text"
                  />
                  <TextField
                    fullWidth
                    id="account"
                    name="account"
                    label="Tài khoản"
                    value={props.currentUser.account}
                    className={cx("mb-2")}
                    type="text"
                    disabled
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
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box
                        className={cx("boxUploadImage")}
                        onClick={handleOpenUploadImg}
                      >
                        {avatar ? (
                          <img
                            src={
                              typeof avatar == "object" ? avatar.url : avatar
                            }
                            className={cx("avatar")}
                          />
                        ) : (
                          <AddPhotoAlternateIcon></AddPhotoAlternateIcon>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                  <input
                    ref={fileUpload}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleChangeFile}
                    name="images[]"
                    id="images"
                    className="hidden"
                  />
                  {isSubmitting && <LinearProgress></LinearProgress>}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} variant="warning">
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="outlined"
                    onClick={handleSubmit}
                  >
                    Lưu
                  </Button>
                </DialogActions>
              </Dialog>
            </form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default connect(mapStateToProps)(InformationUser);
