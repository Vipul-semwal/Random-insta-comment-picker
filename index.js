require('dotenv').config();
const express = require('express');
const https = require('https');
const app = express();
const axios = require('axios');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// app.get('/', (req, res) => res.render('result', generateDummyData("",10)  ));
app.get('/', (req, res) => res.render('form',   ));

app.post('/pick', async (req, res) => {
  try {
    const { url,limit } = req.body;
    const mediaCode = extractMediaCode(url);
if (!mediaCode) throw new Error('Invalid Instagram URL');

console.log('no:',typeof limit)


    if (!mediaCode) {
      return res.status(400).json({ error: 'Instagram media code is required' });
    };

    const result = await getRandomCommentFromRapidAPI(mediaCode, "",+limit);
    console.log('API result:', result);
    if(result.error){
       res.status(500).render('error',{
        error:result.error
       })
    return
    };
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

  if (keyword) {
    const kw = keyword.toLowerCase();
    filtered = filtered.filter(c => c.text.toLowerCase().includes(kw));
  }

  if (!filtered.length) {
    return { error: `No comments found${keyword ? ' matching "' + keyword + '"' : ''}` };
  }

   const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  const pick = shuffled.slice(0, limit);

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

function generateDummyData(keyword, limit = 1) {
  const dummyComments = [
    {username: 'creative_soul', text: 'This is absolutely stunning! 😍 #art', profilePic: 'https://randomuser.me/api/portraits/women/12.jpg'},
    {username: 'travel_buddy', text: 'Wish I was there right now! ✈️ #travel', profilePic: 'https://randomuser.me/api/portraits/men/32.jpg'},
    {username: 'foodie_forever', text: 'This looks delicious! 😋 #food', profilePic: 'https://randomuser.me/api/portraits/women/44.jpg'},
    {username: 'tech_guru', text: 'Amazing technology! #innovation', profilePic: 'https://randomuser.me/api/portraits/men/67.jpg'},
    {username: 'fitness_freak', text: 'Great workout routine! 💪 #fitness', profilePic: 'https://randomuser.me/api/portraits/women/68.jpg'},
    {username: 'nature_lover', text: 'Beautiful scenery! 🌿 #nature', profilePic: 'https://randomuser.me/api/portraits/men/22.jpg'},
    {username: 'bookworm', text: 'Just finished this amazing book! #reading', profilePic: 'https://randomuser.me/api/portraits/women/33.jpg'},
    {username: 'music_maestro', text: 'This song is stuck in my head! 🎵 #music', profilePic: 'https://randomuser.me/api/portraits/men/55.jpg'},
    {username: 'pet_lover', text: 'Your dog is so cute! 🐶 #pets', profilePic: 'https://randomuser.me/api/portraits/women/77.jpg'},
    {username: 'fashion_icon', text: 'Love this outfit! 👗 #fashion', profilePic: 'https://randomuser.me/api/portraits/women/88.jpg'}
  ];

  let filtered = [...dummyComments];
  
//   // Apply keyword filter if provided
//   if (keyword) {
//     const kw = keyword.toLowerCase();
//     filtered = filtered.filter(c => 
//       c.text.toLowerCase().includes(kw) || 
//       c.username.toLowerCase().includes(kw)
//   }

  if (!filtered.length) {
    return { error: `No comments found${keyword ? ' matching "' + keyword + '"' : ''}` };
  }

  // Shuffle and select winners
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  const pick = shuffled.slice(0, limit);

  return {
    pick,
    count: filtered.length,
    keyword,
    limit
  };
}


function extractMediaCode(url) {
  const match = url.match(/(?:reel|p|tv)\/([^/?#&]+)/);
  return match ? match[1] : null;
}

app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));
