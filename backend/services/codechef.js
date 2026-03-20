const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Fetch CodeChef rating and solved count for a given handle.
 * Uses the unofficial CodeChef API + profile page scrape.
 * Returns { ccRating, ccSolved }
 */
const getCodeChefStats = async (handle) => {
  try {
    const res = await axios.get(`https://www.codechef.com/users/${handle}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(res.data);

    // Rating
    let ccRating = 0;
    const ratingElem = $('.rating-number');
    if (ratingElem.length) {
      ccRating = parseInt(ratingElem.first().text().trim(), 10) || 0;
    }

    // Solved count — CodeChef shows "Total Problems Solved: N" in an h3 tag
    let ccSolved = 0;
    $('h3').each((_, el) => {
      const text = $(el).text();
      if (text.includes('Total Problems Solved:')) {
        const match = text.match(/Total Problems Solved:\s*(\d+)/i);
        if (match) ccSolved = parseInt(match[1], 10);
      }
    });

    return { ccRating, ccSolved };
  } catch (err) {
    console.error(`[CC] Error fetching stats for ${handle}:`, err.message);
    return { ccRating: 0, ccSolved: 0 };
  }
};

module.exports = { getCodeChefStats };
