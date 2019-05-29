const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/Users');

// @route    Post Api
// @desc     Create a post
// @access   Private

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
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    Get api/posts
// @desc     Fetch all posts
// @access   Private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //most recent posts
    res.json(posts);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    Get api/posts/:id
// @desc     Search post by id
// @access   Private

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //most recent posts
    if (!post) {
      res.status(404).json({ msg: 'Post Not Found' });
    }
    res.json(post);
  } catch (error) {
    console.log(error.message);

    if (error.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post Not Found' });
    }

    res.status(500).send('Server Error');
  }
});

// @route    Delete api/posts/:id
// @desc     delete a post
// @access   Private

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //most recent posts

    if (!post) {
      res.status(404).json({ msg: 'Post Not Found' });
    }
    //Check User
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not athorized !' });
    }
    await post.remove();

    res.json({ msg: 'Post Removed!' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post Not Found' });
    }

    console.log(error.message);
    res.status(500).send('Server Error');
  }
});
// @route    Put api/posts/like/:id
// @desc     like a post
// @access   Private

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route    Put api/posts/dislike/:id
// @desc     like a post
// @access   Private

router.put('/dislike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
    //remove index

    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    Post api/posts/comments/:id
// @desc     comment on a post
// @access   Private

router.post(
  '/comments/:id',
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
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      post.save();

      res.json(post.comments);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);
// @route    Delete api/posts/comments/:id/:comment_id
// @desc     Delete comment on a post
// @access   Private

router.delete('/comments/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //puulout comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    //Make Sure Comment Exist
    if (!comment) {
      return res.status(404).json({ msg: 'Comment Not Found' });
    }

    //Check user authorization

    if (comment.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: 'User is not authorized' });
    }

    //remove index

    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
