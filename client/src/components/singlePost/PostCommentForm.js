import React from 'react';

const PostCommentForm = () => {
  return (
    <div>
      <form class='form my-1'>
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Comment on this post'
          required
        />
        <input type='submit' class='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

export default PostCommentForm;
