const User = require('../models/User');
const UserBook = require('../models/UserBook');
const fs = require('fs');
const path = require('path');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.file) {
      user.profilePic = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile picture' });
  }
};

module.exports = { getUserProfile, updateUserProfile };

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete related user-book records
    await UserBook.deleteMany({ user: userId });

    // Remove profile picture file from uploads (if it's not the default placeholder)
    if (user.profilePic && user.profilePic.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', user.profilePic);
      fs.unlink(filePath, (err) => {
        // ignore unlink errors but log them
        if (err) console.error('Error deleting profile pic:', err);
      });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User and related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserProfile, updateUserProfile, deleteUser };