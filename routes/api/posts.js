const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
//middleware for auth token
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const User = require('../../models/User');

//@route  POST api/posts
//@desc   Create a post
//@access Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      //getting user information
      const user = await User.findById(req.user.id).select('-password');
      //building new post
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });
      //saving the post
      const post = await newPost.save();
      //returning the post
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);
//@route  GET api/posts
//@desc   Get all post
//@access Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
//@route  GET api/posts/:post_id
//@desc   Get post by ID
//@access Private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});
//@route  DELETE api/posts/:post_id
//@desc   delete a post
//@access Private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    //finding the post
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    //check user is owner of post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'You do not have permission' });
    }
    //removing the post if owner
    await post.remove();
    //returning delete message
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

//@route  PUT api/posts/like/:id
//@desc   like a post
//@access Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    //getting the post
    const post = await Post.findById(req.params.id);
    //checking if the user id is already in the post likes
    let alreadyLiked =
      post.likes.filter(like => like.user.toString() === req.user.id).length >
      0;
    if (alreadyLiked) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    //if not liked already adding to front of the array
    post.likes.unshift({ user: req.user.id });
    //saving the post update
    await post.save();
    //returning the likes for front end update
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  PUT api/posts/unlike/:id
//@desc   Remove a like on post
//@access Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    //getting the post
    const post = await Post.findById(req.params.id);
    //checking if the user id is already in the post likes
    let alreadyLiked =
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0;
    if (alreadyLiked) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
    //get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    //removing the like
    post.likes.splice(removeIndex, 1);
    //saving the post update
    await post.save();
    //returning the likes for front end update
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
//@route  POST api/posts/comment/:id
//@desc   Create a comment on post
//@access Private
router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      //getting user information
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);
      //building new post
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };
      //adding comment to front of array
      post.comments.unshift(newComment);
      //saving the post
      await post.save();
      //returning the post
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);
//@route  DELETE api/posts/comment/:id/:comment_id
//@desc   Delete a comment on post
//@access Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    //get the post
    const post = await Post.findById(req.params.id);
    //pulling out the comment - gives comment or false
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: 'No comment found' });
    }
    //checking user is the owner of comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    //get remove index
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);
    //removing the comment
    post.comments.splice(removeIndex, 1);
    //saving the post update
    await post.save();
    //returning the comments for front end update
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
