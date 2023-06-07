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
  OutlinedInput,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
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
import { useTheme } from "@mui/material/styles";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    currentUser: state.commonReducer.currentUser
  };
};

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
  const [typeChoosed, setTypeChoosed] = React.useState([]);
  const theme = useTheme();

  function getStyles(name, typeChoosed, theme) {
    return {
      fontWeight:
        typeChoosed.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

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

  const handleChangeTypeChoosed = (event) => {
    const {
      target: { value },
    } = event;
    setTypeChoosed(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleDeleteSelection = async (chipToDelete) => {
    setTypeChoosed((chips) => chips.filter((chip) => chip.id != chipToDelete.id));
  };

  return (
    <div>
      {
        props.currentUser &&       
        <Button variant="outlined" onClick={handleClickOpen}>
          Tạo bài viết
        </Button>
      }
      <Formik
        initialValues={{
          title: '',
          shortDescription: '',
          images: [],
        }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          if(editorRef.current.getContent().length <= 0 || typeChoosed.length === 0) {
            store.dispatch(updateTextAlert('Hãy nhập đầy đủ thông tin'));
            setTimeout(() => {
              store.dispatch(updateTextAlert(''));
            }, 3000)
            setSubmitting(false);
            return;
          }
          values.categories = typeChoosed;
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
                <Grid className={cx("mb-2")} container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl sx={{ width: '100%' }}>
                      <InputLabel id="demo-multiple-chip-label">Thể loại</InputLabel>
                      <Select
                        labelId="demo-multiple-chip-label"
                        id="selectTypeChoosed"
                        multiple
                        value={typeChoosed}
                        onChange={handleChangeTypeChoosed}
                        input={<OutlinedInput id="select-multiple-chip" label="Thể loại" />}
                        label="Thể loại"
                        renderValue={(selected) => (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            <>
                              {selected.map((value) => (
                                <Chip key={value.id} label={value.name} color="primary" 
                                deleteIcon={
                                  <CancelIcon
                                    onMouseDown={(event) => event.stopPropagation()}
                                  />
                                }
                                onDelete={() => handleDeleteSelection(value)}/>
                              ))}
                            </>
                          </Box>
                        )}
                        style={{ width: '100%' }}
                        MenuProps={props.MenuProps}
                      >
                        {
                          props.listType.map((x) => (
                            x.id !== '' &&
                            <MenuItem
                              key={x.id}
                              value={x}
                              style={getStyles(x.name, typeChoosed, theme)}
                            >
                              {x.name}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid className={cx("mb-2")} container spacing={2}>
                  { listFile.map((x, index) => (
                    <Grid key={index} item md={6} xs={12}>
                      <Box className={cx('boxUploadImage')} onClick={handleOpenUploadImg}>
                        <img src={x.url} className={cx('image-preview')} alt="preview" />
                      </Box>
                    </Grid>
                  ))}
                  <Grid item md={6} xs={12}>
                    {
                      listFile.length < 4 && 
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
                <InputLabel>Nội dung bài viết</InputLabel>
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

export default connect(mapStateToProps)(CreateBlog);
