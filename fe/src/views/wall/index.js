import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as userService from "../../services/userService";
import classNames from "classnames/bind";
import styles from "./Wall.module.scss";
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import StarPurple500OutlinedIcon from "@mui/icons-material/StarPurple500Outlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import { Level } from "../../utils/constants";
import moment from "moment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

const colorAvatar = [
  "red",
  "pink",
  "grey",
  "blue",
  "green",
  "yellow",
  "orange",
  "gray",
  "#123333",
  "#678123",
];

const cx = classNames.bind(styles);

function Wall() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [listBlog, setListBlog] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    setLoading(true);
    Promise.all([
      userService.getListBlogOfUser(id).then((data) => {
        setListBlog(data);
      }),
      userService.getById(id).then((data) => {
        setUser(data);
      }),
    ]).then(() => {
      setLoading(false);
    });
  }, [id]);

  const formatTime = useCallback((val) => {
    return moment(val, "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY hh:mm");
  }, []);

  return (
    <>
      {loading ? (
        <div className={cx("loading_2")}>
          <div className={cx("loading_2__bar")}></div>
          <div className={cx("loading_2__bar")}></div>
          <div className={cx("loading_2__bar")}></div>
          <div className={cx("loading_2__bar")}></div>
        </div>
      ) : 
      (
        <>
          <Box className={cx("wrapper", "mt-2")}>
            <Grid item alignItems={'center'} textAlign={'center'} marginY={{ xs: 3 }}>
              <Card>
                <Badge
                  overlap="circular"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  badgeContent={
                    user.level !== Level.NONE ? (
                      <Tooltip title="VIP">
                        <StarPurple500OutlinedIcon
                          className={cx('blinking-icon')}
                          style={{ color: "red", fontSize: '65px' }}
                        />
                      </Tooltip>
                    ) : (
                      <></>
                    )
                  }
                >
                  <Avatar
                    sx={{
                      bgcolor: colorAvatar[user.id % 10],
                      width: '200px',
                      height: '200px',
                      objectFit: 'contain',
                      margin: '0px auto'
                    }}
                    aria-label="avatar"
                    alt="avatar"
                    src={`https://docs.google.com/uc?id=${user.avatar}`}
                  >
                    {user.name[0]}
                  </Avatar>
                </Badge>
                <CardHeader
                  title={<h2>{user.name}</h2>}
                  subheader={user.description}
                ></CardHeader>
              </Card>
            </Grid>
          </Box>
          {listBlog.length === 0 ? (
            <h1>Chưa có bài viết nào</h1>
          ) : (
            <>
              {listBlog.map((x, index) => (
                <Box key={index} className={cx("wrapper", "mt-2", "detail-blog")}>
                  <Grid
                    item
                    className={cx("item")}
                    style={{ height: "min-content" }}
                    marginY={{ xs: 3 }}
                  >
                    <Card sx={{ maxWidth: "100%" }}>
                      <CardHeader
                        avatar={
                          <Badge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            badgeContent={
                              x.user.level !== Level.NONE ? (
                                <Tooltip title="VIP">
                                  <StarPurple500OutlinedIcon
                                    style={{ color: "red" }}
                                  />
                                </Tooltip>
                              ) : (
                                <></>
                              )
                            }
                          >
                            <Avatar
                              sx={{
                                bgcolor: colorAvatar[x.user.id % 10],
                              }}
                              aria-label="recipe"
                              alt=""
                              src={`https://docs.google.com/uc?id=${x.user.avatar}`}
                            >
                              {x.user.name[0]}
                            </Avatar>{" "}
                          </Badge>
                        }
                        action={
                          <IconButton aria-label="settings">
                            <MoreVertIcon />
                          </IconButton>
                        }
                        title={x.user.name}
                        subheader={formatTime(x.updated_at)}
                      />
                      <Link to={`/${x.id}`}>
                        <CardContent>
                          <Box>
                            <Grid container spacing={2}>
                              {x.blog_medias.length > 0 &&
                                x.blog_medias.map((img) => (
                                  <Grid key={img.id} item sm={12} md={3}>
                                    <CardMedia
                                      component="img"
                                      height="300"
                                      image={`https://docs.google.com/uc?id=${img.url}`}
                                      alt="Image"
                                      aria-describedby={img.id}
                                      className={cx(
                                        "image-blog",
                                        "border-radius-1"
                                      )}
                                    />
                                  </Grid>
                                ))}
                            </Grid>
                          </Box>
                        </CardContent>
                        <CardContent>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            className={cx("word-break")}
                          >
                            {x.short_description}
                          </Typography>
                        </CardContent>
                      </Link>
                      <CardActions disableSpacing>
                        <IconButton>
                          <FavoriteIcon sx={{ color: "pink" }} />
                        </IconButton>
                        {x.blog_likes_count}
                        <IconButton disableRipple>
                          <RemoveRedEyeOutlinedIcon
                            style={{ verticalAlign: "middle" }}
                          ></RemoveRedEyeOutlinedIcon>
                        </IconButton>
                        {x.view}
                        <IconButton aria-label="share">
                          <ShareIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                </Box>
              ))}
            </>
          )}
        </>
      )}
    </>
  )
}

export default Wall;
