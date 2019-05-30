import React, { useEffect } from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import PostCommentForm from './PostCommentForm';
import CommentItem from './CommentItem';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getSinglePost } from '../../actions/post';

const Post = props => {
  const { getSinglePost, match } = props;
  const { post, loading } = props.post;
  useEffect(() => {
    getSinglePost(match.params.id);
  }, []);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Link to='/posts' class='btn'>
            Back To Posts
          </Link>
          <div class='post bg-white p-1 my-1'>
            <div>
              <Link to={`/developers/${post.user}`}>
                <img class='round-img' src={post.avatar} alt='' />
                <h4>{post.name}</h4>
              </Link>
            </div>
            <div>
              <p class='post-date'>
                Posted on <Moment format='MM/DD/YYYY'>{post.date}</Moment>
              </p>
              <p class='my-1'>{post.text}</p>
            </div>
          </div>

          <div class='bg-primary p'>
            <h3>Leave A Comment</h3>
          </div>
          <PostCommentForm />
          <div class='comments'>
            <CommentItem />
          </div>
        </>
      )}
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getSinglePost }
)(Post);
