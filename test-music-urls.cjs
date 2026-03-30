const https = require('https');

const urls = [
  'https://www.bensound.com/bensound-music/bensound-relaxing.mp3',
  'https://cdn.pixabay.com/audio/2022/05/16/audio_b281f62b10.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg'
];

urls.forEach(url => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    console.log(url, res.statusCode, res.headers['content-type'], res.headers['access-control-allow-origin']);
  }).on('error', (e) => console.error(url, e.message));
});
