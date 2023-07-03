import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  LinearProgress,
  Modal,
  Typography,
} from "@mui/material";
import classNames from "classnames/bind";
import styles from "./Tips.module.scss";
import * as menuTipsService from "../../services/menuTipsService";
import * as tipsService from "../../services/tipsService";
import { useEffect, useRef, useState } from "react";
import { TreeItem, TreeView } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import store from "../../store";
import { connect } from "react-redux";
import { updateStatusLoading } from "../../store/actions/commonAction";
import { Close } from "@mui/icons-material";

const cx = classNames.bind(styles);

const mapStateToProps = (state) => {
  return {
    loading: state.commonReducer.loading,
  };
};

function Tips() {
  const [node, setNode] = useState(null);
  const [listGame, setlistGame] = useState([]);
  const [listShow, setListShow] = useState([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const remoteVideoRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    menuTipsService.menuTips().then((res) => {
      setlistGame(res);
    });
  }, []);

  const handleChangeGame = (id) => {
    setNode(id);
    store.dispatch(updateStatusLoading(true));
    tipsService.tips(id).then((res) => {
      setListShow(res);
      store.dispatch(updateStatusLoading(false));
    });
  };

  const renderTreeMenu = (menu) => {
    return menu.map((x) => (
      <TreeItem
        nodeId={x.id + ""}
        label={x.name}
        key={x.id}
        onClick={
          x.recursive_tree.length === 0 && x.id != node
            ? () => handleChangeGame(x.id)
            : () => {}
        }
      >
        {renderTreeMenu(x.recursive_tree)}
      </TreeItem>
    ));
  };

  const handleOpen = (url) => {
    setOpen(true);
    setTimeout(() => {
      remoteVideoRef.current.src = `https://docs.google.com/uc?id=${url}`;
      remoteVideoRef.current.type = ' video/mp4; codecs="theora, vorbis" ';
      remoteVideoRef.current.load();
      remoteVideoRef.current.play();
    }, 0);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box className={cx("wrapper", "mt-4", "tips")}>
      <Grid container spacing={1}>
        <Grid item xs={12} my={2}>
          <TreeView
            aria-label="game navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{
              flexGrow: 1,
              width: "100%",
              overflowY: "auto",
            }}
          >
            {listGame.map((x) => (
              <TreeItem
                nodeId={x.id + ""}
                label={x.name}
                key={x.id}
                onClick={
                  x.recursive_tree.length === 0 && x.id != node
                    ? () => handleChangeGame(x.id)
                    : () => {}
                }
              >
                {renderTreeMenu(x.recursive_tree)}
              </TreeItem>
            ))}
          </TreeView>
        </Grid>
        {listShow.map((x) => (
          <Grid item xs={12} md={4}>
            <div
              className={cx("wrap-item")}
              onClick={() => handleOpen(x.url)}
              key={x.id}
            >
              <Card sx={{ width: "100%" }} className={cx("item")}>
                <CardMedia
                  sx={{ height: 250 }}
                  image={`https://docs.google.com/uc?id=${x.thumbnail}`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {x.title}
                  </Typography>
                </CardContent>
              </Card>
              <div className={cx("layer-play-btn")}></div>
            </div>
          </Grid>
        ))}
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        closeAfterTransition
        className={cx(
          "d-flex",
          "justify-content-center",
          "text-center",
          "video-tip"
        )}
      >
        <Box>
          <Card>
            <CardHeader
              action={
                <IconButton aria-label="close" onClick={handleClose}>
                  <Close />
                </IconButton>
              }
            ></CardHeader>
            <CardContent>
              <video ref={remoteVideoRef} controls></video>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
}

export default connect(mapStateToProps)(Tips);
