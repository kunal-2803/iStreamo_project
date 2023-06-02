const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/user');
const Post = require('../models/Post');

// Profile details
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Follower count
router.get('/profile/followers', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({ count: user.followers?.length ?? 0});
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Following count
router.get('/profile/following', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({ count: user.following?.length ?? 0});
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get list of users who liked my post
router.get('/profile/liked-posts', authMiddleware, async (req, res) => {
  try {
    const likedPosts = await Post.aggregate([
      {
        $match: {
          likes: req.user._id
        }
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

    res.status(200).json({ likedPosts });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Post count
router.get('/profile/post-count', authMiddleware, async (req, res) => {
  try {
    const count = await Post.countDocuments({ userId: req.user._id });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/profile', authMiddleware, async (req, res) => {
    try {
      const { name, gender, mobile, isPrivateProfile } = req.body;
  
      // Update the profile details
      await User.findByIdAndUpdate(req.user._id, {
        name,
        gender,
        mobile,
        isPrivateProfile
      });
  
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = router;
