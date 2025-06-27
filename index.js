require('dotenv').config();
const express = require('express');
const https = require('https');
const app = express();
const axios = require('axios');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// app.get('/', (req, res) => res.render('result', {
//   pick: {username: 'vipul daddyji!!', text: 'so goood!!' },
//   count: 0,
//   keyword: '',
//    profilePic: 'https://via.placeholder.com/150',
// }   ));
app.get('/', (req, res) => res.render('form',   ));

app.post('/pick', async (req, res) => {
  try {
    const { url, keyword } = req.body;
    const mediaCode = extractMediaCode(url);
if (!mediaCode) throw new Error('Invalid Instagram URL');


    if (!mediaCode) {
      return res.status(400).json({ error: 'Instagram media code is required' });
    }

    const result = await getRandomCommentFromRapidAPI(mediaCode, keyword);
    console.log('API result:', result);
    if(result.error){
       res.status(500).render('error',{
        error:result.error
       })
    return
    }
    res.render('result', result);
  } catch (err) {
    console.error('API error:', err);
    res.status(500).render('error', { 
      error: `Failed to get comments: ${err.message}` 
    });
  }
});


app.get('/proxy-image', async (req, res) => {
  try {
    const imageUrl = decodeURIComponent(req.query.url);

    const response = await axios.get(imageUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
    response.data.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading image');
  }
});

async function getRandomCommentFromRapidAPI(mediaCode, keyword) {
  const apiKey = process.env.RAPID_API_KEY;
  if (!apiKey) throw new Error('RapidAPI key not configured');

  const options = {
    method: 'GET',
    hostname: 'instagram-scraper-stable-api.p.rapidapi.com',
    path: `/get_post_comments.php?media_code=${mediaCode}&sort_order=popular`,
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'instagram-scraper-stable-api.p.rapidapi.com'
    }
  };

  let isEnoughRequest = true;

 try {
     const comments = await new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
       console.log("Status Code:", res.statusCode);
    console.log("Status Message:", res.statusMessage);
    if (res.statusCode === 429) {
        isEnoughRequest = false;
        reject(new Error('Rate limited by API (429)'));
        return; // prevent further logic
      }


      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.comments || []);
        } catch (e) {
          reject(new Error('Failed to parse response from API'));
        }
      });
    });

    req.on('error', err => reject(err));
    req.end();
  });

  let filtered = comments.map(c => ({
    username: c.user?.username || 'unknown',
    text: c.text,
    profilePic: c.user?.profile_pic_url || 'https://via.placeholder.com/150',
  }));

  if (keyword) {
    const kw = keyword.toLowerCase();
    filtered = filtered.filter(c => c.text.toLowerCase().includes(kw));
  }

  if (!filtered.length) {
    return { error: `No comments found${keyword ? ' matching "' + keyword + '"' : ''}` };
  }

  const pick = filtered[Math.floor(Math.random() * filtered.length)];
  return {
    pick,
    count: filtered.length,
    keyword
  };
 } catch (error) {
    console.log('error fetching comments:', error.message)
    return {error:error.message}

 }
}


function extractMediaCode(url) {
  const match = url.match(/(?:reel|p|tv)\/([^/?#&]+)/);
  return match ? match[1] : null;
}

app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));
