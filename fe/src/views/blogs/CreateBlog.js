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
} from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Formik } from "formik";
import * as Yup from "yup";
import classNames from "classnames/bind";
import styles from "./Blog.module.scss";
import * as blogService from "../../services/blogService";
import { Box } from "@mui/system";
import { updateTextAlert } from "../../store/actions/commonAction";
import store from '../../store'
import TinyMCE from "../../components/TextEditor/TinyMCE";

const cx = classNames.bind(styles);

const schema = Yup.object().shape({
  title: Yup.string()
    .required("Yêu cầu")
    .max(200, "Tối đa 200 ký tự"),
  shortDescription: Yup.string()
    .required("Yêu cầu")
    .max(200, "Tối đa 200 ký tự"),
});

const CreateBlog = (props) => {
  const [open, setOpen] = React.useState(false);
  const [listFile, setListFile] = React.useState([]);
  const fileUpload = React.useRef(null);
  const editorRef = React.useRef(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUploadBlog = async (values) => {
    await blogService.createBlogs(values).then((res) => {
      props.createBlog(res);
      handleClose();
    });
  };

  const handleOpenUploadImg = async () => {
    fileUpload.current.click();
  }

  const handleChangeFile = (event) => {
    const selectedImage = event.target.files[0];
    if(selectedImage.size > 10485760) {
      store.dispatch(updateTextAlert('File không được lớn quá 10MB'));
      setTimeout(() => {
        store.dispatch(updateTextAlert(''));
      }, 3000)
      return;
    }
    selectedImage.url = URL.createObjectURL(selectedImage);
    setListFile([...listFile, selectedImage])
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Tạo bài viết
      </Button>
      <Formik
        initialValues={{
          title: '',
          shortDescription: '',
          images: [],
        }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          values.description = editorRef.current.getContent();
          values.images = listFile;
          await handleUploadBlog(values);
          setSubmitting(false);
          store.dispatch(updateTextAlert('Đăng bài thành công'));
          setTimeout(() => {
            store.dispatch(updateTextAlert(''));
          }, 3000)
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
              <DialogTitle>Tạo bài viết</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Tiêu đề"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                  className={cx("mb-2", "mt-2")}
                  type="text"
                />
                <TextField
                  fullWidth
                  id="shortDescription"
                  name="shortDescription"
                  label="Mô tả ngắn gọn"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.shortDescription}
                  error={touched.shortDescription && Boolean(errors.shortDescription)}
                  helperText={touched.shortDescription && errors.shortDescription}
                  className={cx("mb-2")}
                  type="text"
                />
                {/* <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Mô tả"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.description}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                  className={cx("mb-2")}
                  type="text"
                /> */}
                <Grid container spacing={2}>
                  { listFile.map((x, index) => (
                    <Grid key={index} item md={6} xs={12}>
                      <Box className={cx('boxUploadImage')} onClick={handleOpenUploadImg}>
                        <img src={x.url} className={cx('image-preview')} alt="preview" />
                      </Box>
                    </Grid>
                  ))}
                  <Grid item md={6} xs={12}>
                    {
                      listFile.length < 10 && 
                      <Box className={cx('boxUploadImage')} onClick={handleOpenUploadImg}>
                        <AddPhotoAlternateIcon></AddPhotoAlternateIcon>
                      </Box>
                    }
                  </Grid>
                </Grid>
                <input 
                  ref={fileUpload} 
                  type="file" 
                  accept="image/*" 
                  onChange={handleChangeFile} 
                  name="images[]" 
                  id="images" 
                  multiple
                  className="hidden"/>
                <TinyMCE editorRef={editorRef}></TinyMCE>
                {isSubmitting && <LinearProgress></LinearProgress>}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} variant="warning">Hủy bỏ</Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="outlined"
                  onClick={handleSubmit}
                >
                  Đăng bài
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default CreateBlog;
