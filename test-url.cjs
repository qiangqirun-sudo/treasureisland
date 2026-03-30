const https = require('https');
https.get('https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3', (res) => {
  console.log(res.statusCode);
});
