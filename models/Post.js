const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    images: [{ type: String }],
    videos: [{ type: String }],
    isPrivate: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;