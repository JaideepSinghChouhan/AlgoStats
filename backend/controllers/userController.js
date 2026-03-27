const User = require('../models/User');
const { getCodeforcesStats } = require('../services/codeforces');
const { getLeetCodeStats } = require('../services/leetcode');
const { getCodeChefStats } = require('../services/codechef');
const { getAtCoderStats } = require('../services/atcoder');
const { computeScore } = require('../utils/scoreCalc');

// Helper to fetch & update all stats for a user document
const fetchAndUpdateStats = async (user) => {
  const updates = {};

  if (user.cfHandle) {
    const cf = await getCodeforcesStats(user.cfHandle);
    updates.cfRating = cf.cfRating;
    updates.cfMaxRating = cf.cfMaxRating;
    updates.cfSolved = cf.cfSolved;
  } else {
    updates.cfRating = 0;
    updates.cfMaxRating = 0;
    updates.cfSolved = 0;
  }

  if (user.lcHandle) {
    const lc = await getLeetCodeStats(user.lcHandle);
    updates.lcContestRating = lc.lcContestRating;
    updates.lcSolved = lc.lcSolved;
  } else {
    updates.lcContestRating = 0;
    updates.lcSolved = 0;
  }

  if (user.ccHandle) {
    const cc = await getCodeChefStats(user.ccHandle);
    updates.ccRating = cc.ccRating;
    updates.ccSolved = cc.ccSolved;
  } else {
    updates.ccRating = 0;
    updates.ccSolved = 0;
  }

  if (user.acHandle) {
    const ac = await getAtCoderStats(user.acHandle);
    updates.acRating = ac.acRating;
    updates.acSolved = ac.acSolved;
  } else {
    updates.acRating = 0;
    updates.acSolved = 0;
  }

  updates.score = computeScore({
    cfRating: updates.cfRating ?? user.cfRating,
    lcContestRating: updates.lcContestRating ?? user.lcContestRating,
    lcSolved: updates.lcSolved ?? user.lcSolved,
    ccRating: updates.ccRating ?? user.ccRating,
    acRating: updates.acRating ?? user.acRating,
  });
  updates.lastUpdated = new Date();

  return updates;
};

// @route PUT /api/user/handles
const updateHandles = async (req, res) => {
  const { cfHandle, lcHandle, ccHandle, acHandle } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (cfHandle !== undefined) user.cfHandle = cfHandle;
    if (lcHandle !== undefined) user.lcHandle = lcHandle;
    if (ccHandle !== undefined) user.ccHandle = ccHandle;
    if (acHandle !== undefined) user.acHandle = acHandle;

    // Save handles first (without password re-hash)
    await User.findByIdAndUpdate(req.user._id, {
      cfHandle: user.cfHandle,
      lcHandle: user.lcHandle,
      ccHandle: user.ccHandle,
      acHandle: user.acHandle,
    });

    // Fetch stats
    const updates = await fetchAndUpdateStats(user);
    const updated = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select('-password');

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating handles' });
  }
};

// @route POST /api/user/refresh
const refreshStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const updates = await fetchAndUpdateStats(user);
    const updated = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select('-password');
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error refreshing stats' });
  }
};

// @route GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

module.exports = { updateHandles, refreshStats, getProfile, fetchAndUpdateStats };
