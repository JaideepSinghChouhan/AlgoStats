/**
 * Compute leaderboard score from all platform stats.
 * score = CF_rating * 1.5 + LC_contest_rating * 1.0 + LC_solved * 2 + CC_rating * 1.0 + AC_rating * 1.0
 */
const computeScore = ({ cfRating = 0, lcContestRating = 0, lcSolved = 0, ccRating = 0, acRating = 0 }) => {
  return (
    cfRating * 1.5 +
    lcContestRating * 1.0 +
    lcSolved * 2 +
    ccRating * 1.0 +
    acRating * 1.0
  );
};

module.exports = { computeScore };
