const cron = require('node-cron');
const User = require('../models/User');
const { fetchAndUpdateStats } = require('../controllers/userController');

/**
 * Runs every day at midnight: refreshes stats for all users with at least one handle.
 */
const startStatsUpdater = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Starting daily stats update...');
    try {
      const users = await User.find({
        $or: [
          { cfHandle: { $ne: '' } },
          { lcHandle: { $ne: '' } },
          { ccHandle: { $ne: '' } },
          { acHandle: { $ne: '' } },
        ],
      });

      console.log(`[CRON] Found ${users.length} users to update.`);

      for (const user of users) {
        try {
          const updates = await fetchAndUpdateStats(user);
          await User.findByIdAndUpdate(user._id, updates);
          console.log(`[CRON] Updated: ${user.username}`);
        } catch (err) {
          console.error(`[CRON] Failed for ${user.username}:`, err.message);
        }
      }

      console.log('[CRON] Daily stats update complete.');
    } catch (err) {
      console.error('[CRON] Error during stats update:', err.message);
    }
  });

  console.log('[CRON] Stats updater scheduled (daily at midnight).');
};

module.exports = { startStatsUpdater };
