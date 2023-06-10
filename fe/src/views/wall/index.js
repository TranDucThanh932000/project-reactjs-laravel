import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as userService from "../../services/userService";
import * as friendService from "../../services/friendService";
import * as followService from "../../services/followService";
import classNames from "classnames/bind";
import styles from "./Wall.module.scss";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import StarPurple500OutlinedIcon from "@mui/icons-material/StarPurple500Outlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import { Level, StatusFriend } from "../../utils/constants";
import moment from "moment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import store from "../../store";
import { connect } from "react-redux";
import {
  updateListRankingFollower
} from "../../store/actions/commonAction";
import { openAndCloseChatting, openAndGetMsg } from '../../store/actions/chattingAction';
import * as chattingService from '../../services/chattingService';
import { useNavigate } from "react-router-dom";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

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

const LOADING_STATUS_FRIEND = 9999;
const LOADING_STATUS_FOLLOW_FRIEND = 9999;
const mapStateToProps = (state) => {
  return {
    currentUser: state.commonReducer.currentUser,
    listFollowerRanking: state.commonReducer.listFollowerRanking,
    chatting: state.chattingReducer.chatting,
  };
};

const cx = classNames.bind(styles);

function Wall(props) {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [listBlog, setListBlog] = useState([]);
  const [user, setUser] = useState({});
  const [relationship, setRelationship] = useState({
    status: LOADING_STATUS_FRIEND
  });
  const [followStatus, setFollowStatus] = useState(LOADING_STATUS_FOLLOW_FRIEND);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if(props.currentUser) {
      Promise.all([
        userService.getListBlogOfUser(id).then((data) => {
          setListBlog(data);
        }),
        userService.getById(id).then((data) => {
          setUser(data);
        }),
        friendService.checkRelationship(id)
        .then((data) => {
          if(!data.status) {
            setRelationship({
              status: 0
            });
          } else {
            setRelationship(data);
          }
        }),
        followService.checkStatusFollowing(id)
        .then((data) => {
          if(data) {
            setFollowStatus(true);
          } else {
            setFollowStatus(false);
          }
        })
      ]).then(() => {
        setLoading(false);
      });
    } else {
      setRelationship({
        status: 0
      });
      setFollowStatus(false);
      Promise.all([
        userService.getListBlogOfUser(id).then((data) => {
          setListBlog(data);
        }),
        userService.getById(id).then((data) => {
          setUser(data);
        })
      ]).then(() => {
        setLoading(false);
      });
    }
  }, [id, props.currentUser]);

  const formatTime = useCallback((val) => {
    return moment(val, "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY hh:mm");
  }, []);

  const handleAddFriend = (id) => {
    setRelationship({
      status: LOADING_STATUS_FRIEND
    });
    if(!props.currentUser) {
      navigate('/login');
      return;
    }

    friendService.addFriend(id)
    .then(() => {
      setRelationship({
        status: StatusFriend.WAITTING,
        friend: id,
        user_id: props.currentUser.id
      });
    });

    let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
    let index = newListFL.findIndex(x => x.user_id == id);
    if(index >= 0) {
      newListFL[index].user.friend = [];
      newListFL[index].user.is_add_friend = [
        {
          user_id: props.currentUser.id,
          friend: id,
          status: StatusFriend.WAITTING
        }
      ];
      store.dispatch(updateListRankingFollower(newListFL));
    }
  }

  const handleUnFriend = (friend) => {
    setRelationship({
      status: LOADING_STATUS_FRIEND
    });
    friendService.unFriend(friend)
    .then(() => {
      setRelationship({
        status: 0
      });
    })

    let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
    let index = newListFL.findIndex(x => x.user_id == friend);
    if(index >= 0) {
      newListFL[index].user.friend = [];
      newListFL[index].user.is_add_friend = [];
      store.dispatch(updateListRankingFollower(newListFL));
    }
  }

  const handleCancelRequestFriend = (friend) => {
    setRelationship({
      status: LOADING_STATUS_FRIEND
    });
    friendService.cancelRequest(friend)
    .then(() => {
      setRelationship({
        status: 0
      });
    })

    let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
    let index = newListFL.findIndex(x => x.user_id == friend);
    if(index >= 0) {
      newListFL[index].user.friend = [];
      newListFL[index].user.is_add_friend = [];
      store.dispatch(updateListRankingFollower(newListFL));
    }
  }

  const handleAcceptRequestFriend = (friend) => {
    setRelationship({
      status: LOADING_STATUS_FRIEND
    });
    friendService.acceptRequest(friend)
    .then(() => {
      setRelationship({
        status: StatusFriend.ACCEPTED
      });
    })

    let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
    let index = newListFL.findIndex(x => x.user_id == friend);
    if(index >= 0) {
      newListFL[index].user.friend = [];
      newListFL[index].user.is_add_friend = [
        {
          user_id: friend,
          friend: props.currentUser.id,
          status: StatusFriend.ACCEPTED
        }
      ];
      store.dispatch(updateListRankingFollower(newListFL));
    }
  }

  const handleFollow = (friend) => {
    if(!props.currentUser) {
      navigate('/login');
      return;
    }

    setFollowStatus(LOADING_STATUS_FOLLOW_FRIEND);
    followService.follow(friend)
    .then(() => {
      setFollowStatus(true);
    });

    let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
    let index = newListFL.findIndex(x => x.user_id == friend);
    if(index >= 0) {
      newListFL[index].followed = true;
      store.dispatch(updateListRankingFollower(newListFL));
    }
  }

  const handleUnFollow = (friend) => {
    setFollowStatus(LOADING_STATUS_FOLLOW_FRIEND);
    followService.unfollow(friend)
    .then(() => {
      setFollowStatus(false);
    });

    let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
    let index = newListFL.findIndex(x => x.user_id == friend);
    if(index >= 0) {
      newListFL[index].followed = false;
      store.dispatch(updateListRankingFollower(newListFL));
    }
  }

  const handleSendMessage = async (id) => {
    if(!props.currentUser) {
      navigate('/login');
      return;
    }
    if (
      props.chatting.findIndex(
        (user) => user.toUserId == id
      ) < 0
    ) {
      chattingService
        .getMessageOfFriend(id)
        .then((res) => {
          let newUserMsg = {
            toUserId: id,
            info: res.info,
            currentMsg: "",
            msg: [],
          };
          res.msgs.forEach((msg) => {
            newUserMsg.msg.push({
              message: msg.content,
              toOther:
                id == msg.to_user_id ? true : false,
              created_at: msg.created_at,
              id: msg.id,
            });
          });
          store.dispatch(openAndGetMsg(newUserMsg));
        })
        .catch(() => {});
    } else {
      store.dispatch(openAndCloseChatting(id));
    }
  }

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
                <CardActions style={{ flexDirection: 'row-reverse' }}>
                  {
                    (!props.currentUser || (props.currentUser.id != id)) &&
                    <div>
                      {relationship.status === LOADING_STATUS_FRIEND ?             
                        <Box sx={{ width: '100%' }}>
                          <CircularProgress />
                        </Box>
                      : <></>}
                      {relationship.status === 0 ? <Button startIcon={<PersonAddIcon />} variant="outlined" onClick={() => handleAddFriend(id)}>Kết bạn</Button> : <></>}
                      {relationship.status === StatusFriend.ACCEPTED ? <Button startIcon={<PersonRemoveIcon />} variant="outlined" onClick={() => {handleUnFriend(id)}}>Hủy kết bạn</Button> : <></>}
                      {(relationship.status === StatusFriend.WAITTING && relationship.friend != id) ? <Button startIcon={<HowToRegIcon />} variant="outlined" onClick={() => {handleAcceptRequestFriend(id)}}>Chấp nhận kết bạn</Button> : <></>}
                      {(relationship.status === StatusFriend.WAITTING && relationship.friend == id) ? <Button startIcon={<PersonAddDisabledIcon />} variant="outlined" onClick={() => {handleCancelRequestFriend(id)}}>Hủy gửi mời kết bạn</Button> : <></>}
                      {
                      followStatus === LOADING_STATUS_FOLLOW_FRIEND ?
                        <Box sx={{ width: '100%' }}>
                          <CircularProgress />
                        </Box>
                        :
                        followStatus === false ? <Button sx={{mx: 1}} variant="outlined" startIcon={<AddAlertIcon />} onClick={() => handleFollow(id)}>Theo dõi</Button> : <Button sx={{mx: 1}} variant="outlined" color="primary" startIcon={<NotificationsOffIcon />} onClick={() => handleUnFollow(id)}>Hủy theo dõi</Button>
                      }
                      <Button startIcon={<MessageIcon />} variant="outlined" onClick={() => handleSendMessage(id)}>Nhắn tin</Button>
                    </div>
                  }
                </CardActions>
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

export default connect(mapStateToProps)(Wall);
