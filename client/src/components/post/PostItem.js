import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

const PostItem = props => {
  const { likePost, unlikePost, deletePost, auth } = props;
  const { _id, text, name, avatar, likes, comments, date, user } = props.post;

  const handleLike = () => {
    likePost(_id);
  };
  const handleUnlike = () => {
    unlikePost(_id);
  };
  const handleDelete = () => {
    deletePost(_id);
  };

  return (
    <>
      <div className='post bg-white p-1 my-1'>
        <div>
          <Link to={`/developers/${user}`}>
            <img className='round-img' src={avatar} alt={name} />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className='my-1'>{text}</p>
          <p className='post-date'>
            Posted on <Moment format='MM/DD/YYYY'>{date}</Moment>
          </p>
          <button type='button' className='btn btn-light' onClick={handleLike}>
            <i className='fas fa-thumbs-up' />
            {likes.length > 0 && <span> {likes.length}</span>}
          </button>
          <button
            type='button'
            className='btn btn-light'
            onClick={handleUnlike}>
            <i className='fas fa-thumbs-down' />
          </button>
          <Link to={`/posts/${_id}`} className='btn btn-primary'>
            Discussion{' '}
            {comments.length > 0 && (
              <span className='comment-count'>{comments.length}</span>
            )}
          </Link>

          {auth.user._id.toString() === user.toString() && (
            <button
              type='button'
              className='btn btn-danger'
              onClick={handleDelete}>
              <i className='fas fa-times' />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default PostItem;
