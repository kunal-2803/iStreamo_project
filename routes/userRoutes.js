require('dotenv').config()
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const cookieParser = require('cookie-parser');

// User registration
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      password,
      email,
      username,
      gender,
      mobile,
      isPrivateProfile
    } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      password: hashedPassword,
      email,
      username,
      gender,
      mobile,
      isPrivateProfile
    });

    // Save the user to the database
    await user.save();

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Validate the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Create and sign a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY);
   
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Follow a user
router.post('/follow/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the following list of the current user
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { following: userId }
    });

    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unfollow a user
router.post('/unfollow/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Update the following list of the current user
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: userId }
    });

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;