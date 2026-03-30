const https = require('https');

const urls = [
  'https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3',
  'https://cdn.pixabay.com/audio/2021/11/23/audio_91b3cb0056.mp3',
  'https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3',
  'https://cdn.pixabay.com/audio/2022/05/16/audio_b281f62b10.mp3' // "Please Calm My Mind"
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(url, res.statusCode);
  });
});
