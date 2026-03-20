const User = require('../models/User');

// @route GET /api/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password -email')
      .sort({ score: -1 });

    const leaderboard = users.map((u, index) => ({
      rank: index + 1,
      _id: u._id,
      username: u.username,
      score: Math.round(u.score),
      cfHandle: u.cfHandle,
      cfRating: u.cfRating,
      cfMaxRating: u.cfMaxRating,
      cfSolved: u.cfSolved,
      lcHandle: u.lcHandle,
      lcContestRating: u.lcContestRating,
      lcSolved: u.lcSolved,
      ccHandle: u.ccHandle,
      ccRating: u.ccRating,
      ccSolved: u.ccSolved,
      acHandle: u.acHandle,
      acRating: u.acRating,
      acSolved: u.acSolved,
      lastUpdated: u.lastUpdated,
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

module.exports = { getLeaderboard };
