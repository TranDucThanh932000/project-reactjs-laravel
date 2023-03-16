import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
import styles from './Blog.module.scss';

function Blog() {
  return <div className={cx("wrapper")}>
    <h1>My content</h1>
  </div>;
}

export default Blog;
