import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  NativeSelect,
  TextField,
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { useRef, useState } from "react";
import * as constant from "../../utils/constants";
import styles from "./QrCode.module.scss";
import classNames from "classnames/bind";
import QrCodeIcon from "@mui/icons-material/QrCode";
import * as qrCodeService from "../../services/qrcodeService";
import store from "../../store";
import {
  updateStatusLoading,
  updateTextAlert,
} from "../../store/actions/commonAction";
import { connect } from "react-redux";

const cx = classNames.bind(styles);

const mapStateToProps = (state) => {
  return {};
};

const QrCode = () => {
  const [inputQrCode, setInputQrCode] = useState("");
  const [type, setType] = useState(1);
  const [typesInput, setTypesInput] = useState([
    { name: "Đường dẫn", value: constant.TypeInputQrCode.LINK },
    { name: "Hình ảnh", value: constant.TypeInputQrCode.IMAGE },
  ]);
  const [urlQrCode, setUrlQrCode] = useState("");
  const inputFile = useRef(null);
  const [messageErrorInput, setMessageErrorInput] = useState("");

  const handleChangeInputQrCode = (e) => {
    if (type == constant.TypeInputQrCode.LINK) {
      setInputQrCode(e.target.value);
      if(e.target.value.length > 255) {
        setMessageErrorInput("Không dài quá 255 ký tự")
      } else {
        setMessageErrorInput("");
      }
    }
    setUrlQrCode("");
  };

  const handleChangeSelect = (e) => {
    setType(e.target.value);
    setInputQrCode("");
    setUrlQrCode("");
    setMessageErrorInput("");
  };

  const handleMakeQrCode = () => {
    var images = [];
    store.dispatch(updateStatusLoading(true));
    if (type == constant.TypeInputQrCode.IMAGE) {
      images = document.getElementById('image').files[0];
    }
    qrCodeService
      .makeQrCode({
        inputQrCode: type == constant.TypeInputQrCode.IMAGE ? '' : inputQrCode,
        images
      })
      .then((res) => {
        setUrlQrCode(res);
      })
      .catch(() => {
        console.log("error");
      })
      .finally(() => {
        store.dispatch(updateStatusLoading(false));
      })
  };

  const handleClickInputFile = () => {
    inputFile.current.click();
  };

  const handleOnchangeInputFile = (event) => {
    const selectedImage = event.target.files[0];
    if (!selectedImage) {
      setInputQrCode("");
      setUrlQrCode("");
      return;
    }
    if (selectedImage.size > 10485760 / 2) {
      store.dispatch(updateTextAlert("File không được lớn quá 5MB"));
      setTimeout(() => {
        store.dispatch(updateTextAlert(""));
      }, 3000);
      return;
    }
    if (!selectedImage.type.includes("image/")) {
      store.dispatch(updateTextAlert("Định dạng ảnh không phù hợp"));
      setTimeout(() => {
        store.dispatch(updateTextAlert(""));
      }, 3000);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setInputQrCode(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };

  const handleDownloadImage = () => {
    var svg = document.getElementById("svg").children[0];

    //get svg source.
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svg);

    //add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(
        /^<svg/,
        '<svg xmlns="http://www.w3.org/2000/svg"'
      );
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(
        /^<svg/,
        '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
      );
    }

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    //convert svg source to URI data scheme.
    var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

    var downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "qrcode.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <>
      <div className={cx("wrapper")}>
        <Grid container spacing={2} sx={{ my: 2 }}>
          <Grid item xs={12} md={6} className={cx("py-0")} textAlign={"center"}>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Chọn kiểu dữ liệu đầu vào
              </InputLabel>
              <NativeSelect
                defaultValue={type}
                inputProps={{
                  name: "inputType",
                  id: "uncontrolled-native",
                }}
                onChange={handleChangeSelect}
              >
                {typesInput.map((x, index) => {
                  return (
                    <option value={x.value} key={index}>
                      {x.name}
                    </option>
                  );
                })}
              </NativeSelect>
              {type == constant.TypeInputQrCode.LINK ? (
                <>
                  <TextField
                    id="standard-basic"
                    label="Dữ liệu"
                    variant="standard"
                    value={inputQrCode}
                    onChange={handleChangeInputQrCode}
                    inputProps={{
                      name: "input",
                      id: "uncontrolled-native",
                      type: "text",
                    }}
                  />
                  <div className={cx('text-red')} style={{textAlign: 'left'}}>
                    {messageErrorInput}
                  </div>
                </>
              ) : (
                <>
                  <input
                    onChange={handleOnchangeInputFile}
                    name="image"
                    id="image"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className={cx("d-none")}
                    ref={inputFile}
                  />
                  <Box className={cx("box-img-qr")} onClick={handleClickInputFile}>
                    <img src={inputQrCode} style={{ objectFit: inputQrCode ? "contain" : "cover" }}/>
                    {!inputQrCode && <div className={cx("overlay1")}></div>}
                    <div className={cx("overlay2")}>Chọn hình ảnh +</div>
                  </Box>
                </>
              )}
              <Button
                variant="outlined"
                onClick={handleMakeQrCode}
                sx={{
                  margin: "10px auto",
                }}
                disabled={!inputQrCode}
              >
                Tạo QrCode
                <QrCodeIcon></QrCodeIcon>
              </Button>
            </FormControl>
          </Grid>
          {urlQrCode && (
            <Grid
              item
              xs={12}
              md={6}
              className={cx("py-0")}
              textAlign={"center"}
            >
              <div
                id="svg"
                dangerouslySetInnerHTML={{
                  __html: urlQrCode,
                }}
              ></div>
              <Button
                variant="outlined"
                onClick={handleDownloadImage}
                sx={{
                  margin: "10px auto",
                }}
              >
                Tải xuống
                <DownloadOutlinedIcon></DownloadOutlinedIcon>
              </Button>
            </Grid>
          )}
        </Grid>
      </div>
    </>
  );
};

export default connect(mapStateToProps)(QrCode);
