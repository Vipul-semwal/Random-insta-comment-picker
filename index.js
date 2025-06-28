require('dotenv').config();
const express = require('express');
const https = require('https');
const app = express();
const axios = require('axios');
const FetchuserdataWithPupeteer = require('./scraper'); // Import the scraper module

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const commentDataMap = {
  "DKbYiafRBnr": [
    {
      username: 'asad_qureshi_007',
      text: '🔥🔥',
      profilePic: 'https://instagram.fdel36-1.fna.fbcdn.net/v/t51.2885-19/...BF&_nc_sid=7a9f4b'
    },
    {
      username: 'soni_jaan_ss_',
      text: 'Bharat mobile ko follow karo aur jaldi jaldi gift ka lahb uthao🔥',
      profilePic: 'https://instagram.fdel36-1.fna.fbcdn.net/v/t51.2885-19/...73&_nc_sid=f5838a'
    },
    {
      username: 'arpit_goswami295',
      text: 'Bharat mobile',
      profilePic: 'https://instagram.fdel36-1.fna.fbcdn.net/v/t51.2885-19/...57&_nc_sid=f5838a'
    },
    {
      username: 'akdu_senorita_0517__',
      text: 'Bhart mobile ❤️❤️❤️',
      profilePic: 'https://instagram.fdel36-1.fna.fbcdn.net/v/t51.2885-19/...C4&_nc_sid=f5838a'
    }
    // Add more items from your list if you want
  ]
};

// app.get('/', (req, res) => res.render('result', generateDummyData("",10)  ));
app.get('/', (req, res) => res.render('form',   ));

// app.post('/pick', async (req, res) => {
//   try {
//     const { url,limit } = req.body;
//     const mediaCode = extractMediaCode(url);
// if (!mediaCode) throw new Error('Invalid Instagram URL');

// console.log('no:',typeof limit)


//     if (!mediaCode) {
//       return res.status(400).json({ error: 'Instagram media code is required' });
//     };

//     if(commentDataMap[mediaCode]){
//       const result = getCommentDataByKey(mediaCode, +limit);
//       console.log('In-memory result:', result);
//       if(result.error){
//         res.status(500).render('error', {
//           error: result.error
//         });
//         return;
//       }
//       res.render('result', {...result,keyword:""});
//       return;
//     } 
//     const result = await getRandomCommentFromRapidAPI(mediaCode, "",+limit);
//     console.log('API result:', result);
//     if(result.error){
//        res.status(500).render('error',{
//         error:result.error
//        })
//     return
//     };
//     res.render('result', result);
//   } catch (err) {
//     console.error('API error:', err);
//     res.status(500).render('error', { 
//       error: `Failed to get comments: ${err.message}` 
//     });
//   }
// });

app.post('/pick', async (req, res) => {
  try {
    const { url} = req.body;
    const mediaCode = extractMediaCode(url);
if (!mediaCode) throw new Error('Invalid Instagram URL');
    const result = await FetchuserdataWithPupeteer(url);
    console.log('API result:', result);
    if (!result) {
      return res.status(500).render('error', {
        error: 'Failed! try again.'
      });
    }
    res.render('result', {
      pick: [{...result}],
      count: 1,
      keyword: "",});

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
    console.log('Image URL:', imageUrl);
    if (!imageUrl) {
      return res.status(400).send('Image URL is required');
    }

    const response = await axios.get(imageUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
    response.data.pipe(res);
  } catch (err) {
    // console.error(err);
    res.status(500).send('Error loading image');
  }
});

async function getRandomCommentFromRapidAPI(mediaCode, keyword,limit) {
    console.log('no:',typeof limit)
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

// Optional keyword filter
if (keyword) {
  const kw = keyword.toLowerCase();
  filtered = filtered.filter(c => c.text.toLowerCase().includes(kw));
}

// === Remove duplicate usernames ===
const seen = new Set();
filtered = filtered.filter(c => {
  if (seen.has(c.username)) return false;
  seen.add(c.username);
  return true;
});

if (!filtered.length) {
  return { error: `No comments found${keyword ? ' matching "' + keyword + '"' : ''}` };
}

const shuffled = [...filtered].sort(() => 0.5 - Math.random());
const pick = shuffled.slice(0, limit);

return { pick, count: filtered.length, keyword };
 } catch (error) {
    console.log('error fetching comments:', error.message)
    return {error:error.message}

 }
}

// In-memory comment map
/**
 * Returns a randomized sample of comments for a given keyword key
 * @param {string} key - The keyword identifying the comment group
 * @param {number} limit - Number of comments to return
 * @returns {{pick: Array, count: number, key: string, limit: number}|{error: string}}
 */
function getCommentDataByKey(key, limit = 1) {
  const dataset = commentDataMap[key];

  if (!dataset || !dataset.length) {
    return { error: `No comments found for key "${key}"` };
  }

  const shuffled = [...dataset].sort(() => Math.random() - 0.5);
  const pick = shuffled.slice(0, limit);
  return {
    pick,
    count: dataset.length,
    key,
    limit
  };
}




function extractMediaCode(url) {
  const match = url.match(/(?:reel|p|tv)\/([^/?#&]+)/);
  return match ? match[1] : null;
}

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
