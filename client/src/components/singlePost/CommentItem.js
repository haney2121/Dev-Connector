import React from 'react';

const CommentItem = () => {
  return (
    <div>
      <div class='post bg-white p-1 my-1'>
        <div>
          <a href='profile.html'>
            <img
              class='round-img'
              src='https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
              alt=''
            />
            <h4>John Doe</h4>
          </a>
        </div>
        <div>
          <p class='my-1'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
            possimus corporis sunt necessitatibus! Minus nesciunt soluta
            suscipit nobis. Amet accusamus distinctio cupiditate blanditiis
            dolor? Illo perferendis eveniet cum cupiditate aliquam?
          </p>
          <p class='post-date'>Posted on 04/16/2019</p>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
