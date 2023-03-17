import classNames from 'classnames/bind';
import styles from './Blog.module.scss';
const cx = classNames.bind(styles);

function Blog() {
  return <div className={cx("wrapper")}>
    <h1>My content</h1>
  </div>;
}

export default Blog;
