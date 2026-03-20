const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { updateHandles, refreshStats, getProfile } = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/handles', protect, updateHandles);
router.post('/refresh', protect, refreshStats);

module.exports = router;
