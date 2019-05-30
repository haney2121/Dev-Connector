import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostForm from './PostForm';
import { getPost, deletePost, likePost, unlikePost } from '../../actions/post';
import PropTypes from 'prop-types';
import PostItem from './PostItem';

const Posts = props => {
  const { getPost, likePost, unlikePost, deletePost } = props;
  const { auth } = props;
  const { posts, loading } = props.post;
  useEffect(() => {
    getPost();
  }, [getPost]);
  return (
    <>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome to the community!
      </p>
      <PostForm />
      <div className='posts'>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {posts.length !== 0 ? (
              posts.map(post => (
                <PostItem
                  auth={auth}
                  key={post._id}
                  post={post}
                  likePost={likePost}
                  unlikePost={unlikePost}
                  deletePost={deletePost}
                />
              ))
            ) : (
              <h4>No post have been entered.</h4>
            )}
          </>
        )}
      </div>
    </>
  );
};

Posts.propTypes = {
  post: PropTypes.object.isRequired,
  getPost: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { getPost, likePost, unlikePost, deletePost }
)(Posts);
