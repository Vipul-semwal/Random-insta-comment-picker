// run: npm install node:https node:fs node:querystring

require('dotenv').config();
const https = require('https');
const fs = require('fs');
const { stringify } = require('querystring');

const apiKey = process.env.RAPID_API_KEY;
const API_KEY = apiKey ;
const MEDIA_CODE = 'your_media_code_here';
const LIMIT = 100; // desired total comments
const OUTPUT = 'comments.json';

async function fetchPage(cursor = null) {
  const params = {
    media_code: "DLPk45vyvL3",
    sort_order: 'popular',
    ...(cursor && { cursor }),
  };
  const path = `/get_post_comments.php?${stringify(params)}`;

  return new Promise((resolve, reject) => {
    const req = https.request({
      method: 'GET',
      hostname: 'instagram-scraper-stable-api.p.rapidapi.com',
      path,
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'instagram-scraper-stable-api.p.rapidapi.com'
      }
    }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        if (res.statusCode === 429) {
          return reject(new Error('Rate limited (429)'));
        }
        try {
          const parsed = JSON.parse(raw);
          const comments = parsed.comments || [];
          const nextCursor = parsed.next_cursor || parsed.end_cursor || null;
          resolve({ comments, nextCursor });
        } catch (e) {
          reject(new Error('JSON parse failed'));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  const allComments = [];
  let cursor = null;

  try {
    do {
      const { comments, nextCursor } = await fetchPage(cursor);
      allComments.push(...comments);
      console.log(`Got ${comments.length}, total so far: ${allComments.length}`);
      cursor = nextCursor;
    } while (cursor && allComments.length < LIMIT);

    fs.writeFileSync(OUTPUT, JSON.stringify(allComments, null, 2));
    console.log(`Saved ${allComments.length} comments to ${OUTPUT}`);
  } catch (err) {
    console.error('Error fetching comments:', err);
  }
}

main();
