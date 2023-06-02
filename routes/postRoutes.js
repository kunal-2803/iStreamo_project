const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Post = require('../models/Post');


// Upload post
router.post('/post', authMiddleware, async (req, res) => {
  try {
    const { text, images, videos, isPrivate } = req.body;

    // Create a new post
    const post = new Post({
      userId: req.user._id,
      text,
      images,
      videos,
      isPrivate
    });

    // Save the post to the database
    await post.save();

    res.status(200).json({ message: 'Post uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Like a post
router.post('/like/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    // Update the likes of the post
    await Post.findByIdAndUpdate(postId, {
      $addToSet: { likes: req.user._id }
    });

    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete own post
router.delete('/post/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    // Soft delete the post
    await Post.findByIdAndDelete(postId, { isDeleted: true });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit post
router.put('/post/:postId', authMiddleware, async (req, res) => {
    try {
      const { postId } = req.params;
      const { text, images, videos, isPrivate } = req.body;
  
      // Update the post
      await Post.findByIdAndUpdate(postId, {
        text,
        images,
        videos,
        isPrivate
      });
  
      res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = router;
