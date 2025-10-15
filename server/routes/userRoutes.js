const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getUserProfile, updateUserProfile, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get('/:userId/profile', protect, getUserProfile);
router.put('/:userId/profile', protect, upload.single('profilePic'), updateUserProfile);
router.delete('/:userId', protect, deleteUser);

module.exports = router;