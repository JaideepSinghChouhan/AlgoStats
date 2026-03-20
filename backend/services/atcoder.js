const axios = require('axios');

/**
 * Fetch AtCoder rating and solved count for a given handle.
 * Uses AtCoder Problems public API (kenkoooo.com).
 * Returns { acRating, acSolved }
 */
const getAtCoderStats = async (handle) => {
  try {
    // 1. Rating from AtCoder history API
    let acRating = 0;
    const historyRes = await axios.get(
      `https://atcoder.jp/users/${handle}/history/json`,
      { timeout: 10000 }
    );
    const history = historyRes.data;
    if (Array.isArray(history) && history.length > 0) {
      // Use the most recent contest's NewRating
      acRating = history[history.length - 1].NewRating || 0;
    }

    // 2. Solved count from AtCoder Problems API
    let acSolved = 0;
    const acRes = await axios.get(
      `https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user=${handle}`,
      {
        timeout: 10000,
        headers: { 'Accept-Encoding': 'gzip' },
      }
    );
    // The response has "count" = total AC submissions (unique problems)
    acSolved = acRes.data?.count || 0;

    return { acRating, acSolved };
  } catch (err) {
    console.error(`[AC] Error fetching stats for ${handle}:`, err.message);
    return { acRating: 0, acSolved: 0 };
  }
};

module.exports = { getAtCoderStats };
