import { useEffect, useState, useCallback } from "react";
import * as blogService from "../../services/blogService";
import * as blogLikeService from "../../services/blogLikeService";
import { updateStatusLoading } from "../../store/actions/commonAction";
import { useParams } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import classNames from "classnames/bind";
import styles from "./Blog.module.scss";
import moment from "moment";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { useNavigate } from "react-router-dom";
import store from "../../store";
import { connect } from "react-redux";

const cx = classNames.bind(styles);

const mapStateToProps = (state) => {
  return {
    logged: state.commonReducer.logged,
  };
};

const DetailBlog = (props) => {
  const [blog, setBlog] = useState(null);
  const { blogId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    blogService.getById(blogId).then((res) => {
      setBlog(res);
    });
  }, []);

  const formatTime = useCallback((val) => {
    return moment(val, "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY hh:mm");
  }, []);

  const handleFavorite = async (val) => {
    if (!props.logged) {
      navigate("/login");
      return;
    }
    store.dispatch(updateStatusLoading(true));
    if (val) {
      //like
      await blogLikeService.like(blog.id).then((res) => {
        blog.blog_likes.push(true);
        blog.blog_likes_count = res.newCount;
      });
    } else {
      //unlike
      await blogLikeService.unlike(blog.id).then((res) => {
        blog.blog_likes.pop();
        blog.blog_likes_count = res.newCount;
      });
    }
    store.dispatch(updateStatusLoading(false));
  };

  return (
    <>
      {blog && (
        <Box className={cx("wrapper", "mt-2", "detail-blog")}>
          <h1 dangerouslySetInnerHTML={{ __html: blog.title }}></h1>
          <p>
            Tác giả:{" "}
            <b>
              <i>{blog.user.name}</i>
            </b>
          </p>
          <p>
            Ngày tạo:{" "}
            <b>
              <i>{formatTime(blog.created_at)}</i>
            </b>
          </p>
          <p>
            <b>
              {!blog.blog_likes.length ? (
                <IconButton
                  aria-label="add to favorites"
                  onClick={() => handleFavorite(1)}
                >
                  <FavoriteBorderIcon />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="remove to favorites"
                  onClick={() => handleFavorite(0)}
                >
                  <FavoriteIcon sx={{ color: "pink" }} />
                </IconButton>
              )}
              <i>{blog.blog_likes_count}</i>
            </b>
            {" "}
            <b>
                <RemoveRedEyeOutlinedIcon style={{verticalAlign: 'middle'}}></RemoveRedEyeOutlinedIcon>{" "}
              <i>{blog.view}{" "}</i>
            </b>
          </p>
          <br />
          <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
        </Box>
      )}
    </>
  );
};

export default connect(mapStateToProps)(DetailBlog);
