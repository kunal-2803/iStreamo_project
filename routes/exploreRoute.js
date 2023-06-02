const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/user');

// List public posts with latest uploaded post
router.get('/explore', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $match: { isPrivate: false, isDeleted: false }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          _id: 0,
          postId: '$_id',
          userName: '$user.username',
          postText: '$text',
          isLiked: { $in: [req.user._id, '$likes'] }
        }
      }
    ]);

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Pagination for explore API (show 10 posts per page)
router.get('/explore/page/:page', authMiddleware, async (req, res) => {
  try {
    const page = req.params.page;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.aggregate([
      {
        $match: { isPrivate: false, isDeleted: false }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          _id: 0,
          postId: '$_id',
          userName: '$user.username',
          postText: '$text',
          isLiked: { $in: [req.user._id, '$likes'] }
        }
      }
    ]);

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List posts liked by the user (excluding own posts)
router.get('/liked-posts', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $match: { likes: req.user._id, userId: { $ne: req.user._id }, isDeleted: false }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          _id: 0,
          postId: '$_id',
          userName: '$user.username',
          postText: '$text'
        }
      }
    ]);

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
