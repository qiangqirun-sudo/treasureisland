const https = require('https');
const url = 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg';
https.get(url, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers['content-type']);
});
