const axios = require('axios');

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

/**
 * Fetch LeetCode contest rating and total solved count for a given handle.
 * Returns { lcContestRating, lcSolved }
 */
const getLeetCodeStats = async (handle) => {
  try {
    // Query for solved count
    const solvedQuery = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
      variables: { username: handle },
    };

    const solvedRes = await axios.post(LEETCODE_GRAPHQL, solvedQuery, {
      headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
      timeout: 10000,
    });

    const acStats = solvedRes.data?.data?.matchedUser?.submitStats?.acSubmissionNum || [];
    const allEntry = acStats.find((e) => e.difficulty === 'All');
    const lcSolved = allEntry ? allEntry.count : 0;

    // Query for contest rating
    const contestQuery = {
      query: `
        query getUserContestRanking($username: String!) {
          userContestRanking(username: $username) {
            rating
          }
        }
      `,
      variables: { username: handle },
    };

    const contestRes = await axios.post(LEETCODE_GRAPHQL, contestQuery, {
      headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
      timeout: 10000,
    });

    const lcContestRating = Math.round(
      contestRes.data?.data?.userContestRanking?.rating || 0
    );

    return { lcContestRating, lcSolved };
  } catch (err) {
    console.error(`[LC] Error fetching stats for ${handle}:`, err.message);
    return { lcContestRating: 0, lcSolved: 0 };
  }
};

module.exports = { getLeetCodeStats };
