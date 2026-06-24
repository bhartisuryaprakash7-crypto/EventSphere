const express = require('express');
const User = require('./user.model');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');

// Get all users (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('department', 'name');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'profilePic'];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f]) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle user active status (admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const router = express.Router();
router.get('/',               protect, authorizeRoles('admin'),      getAllUsers);
router.put('/profile',        protect,                               updateProfile);
router.patch('/:id/toggle',   protect, authorizeRoles('admin'),      toggleUserStatus);

module.exports = router;