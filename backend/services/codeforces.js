const axios = require('axios');

/**
 * Fetch Codeforces rating and solved count for a given handle.
 * Returns { cfRating, cfMaxRating, cfSolved }
 */
const getCodeforcesStats = async (handle) => {
  try {
    // 1. Get rating info
    const infoRes = await axios.get(
      `https://codeforces.com/api/user.info?handles=${handle}`,
      { timeout: 10000 }
    );
    const user = infoRes.data.result[0];
    const cfRating = user.rating || 0;
    const cfMaxRating = user.maxRating || 0;

    // 2. Get solved count (unique accepted problems)
    const statusRes = await axios.get(
      `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`,
      { timeout: 15000 }
    );
    const submissions = statusRes.data.result || [];
    const solvedSet = new Set();
    submissions.forEach((sub) => {
      if (sub.verdict === 'OK') {
        solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
      }
    });
    const cfSolved = solvedSet.size;

    return { cfRating, cfMaxRating, cfSolved };
  } catch (err) {
    console.error(`[CF] Error fetching stats for ${handle}:`, err.message);
    return { cfRating: 0, cfMaxRating: 0, cfSolved: 0 };
  }
};

module.exports = { getCodeforcesStats };
