const https = require('https');
https.get('https://upload.wikimedia.org/wikipedia/commons/c/c8/Kevin_MacLeod_-_Acoustic_Breeze.ogg', (res) => {
  console.log(res.statusCode);
});
