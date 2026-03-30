const https = require('https');
const url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
https.get(url, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers['content-type']);
});
