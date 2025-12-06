const User = require('../models/userModel.js');
const xss = require('xss');
const { asyncHandler } = require('../utils/asyncHandler.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

// Get current user profile
const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    location: user.location,
    profilePictureUrl: user.profilePictureUrl || null,
    isProfileComplete: user.isProfileComplete()
  });
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, location, profilePictureUrl } = req.body;

  // Validate required fields
  if (!name || !email || !location) {
    return res.status(400).json({ 
      error: 'Name, email, and location are required' 
    });
  }

  // Sanitize inputs
  const sanitizedName = xss(name);
  const sanitizedEmail = xss(email);
  const sanitizedLocation = xss(location);

  // Check if email is already taken by another user
  const existingUser = await User.findOne({ 
    email: sanitizedEmail, 
    _id: { $ne: req.user._id } 
  });
  
  if (existingUser) {
    return res.status(409).json({ error: 'Email already taken by another user' });
  }

  // Find and update user
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { 
      name: sanitizedName, 
      email: sanitizedEmail, 
      location: sanitizedLocation,
      ...(profilePictureUrl ? { profilePictureUrl: xss(profilePictureUrl) } : {})
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    location: user.location,
    profilePictureUrl: user.profilePictureUrl || null,
    isProfileComplete: user.isProfileComplete(),
    message: 'Profile updated successfully'
  });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  // Upload and set user's profile picture
  uploadProfilePicture: asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const localFilePath = req.file.path;
    const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

    if (!cloudinaryResponse) {
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    const imageUrl = cloudinaryResponse.secure_url;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePictureUrl: imageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ profilePictureUrl: imageUrl });
  })
};
