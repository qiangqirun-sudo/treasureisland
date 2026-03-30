const https = require('https');
https.get('https://upload.wikimedia.org/wikipedia/commons/b/b5/Gymnop%C3%A9die_No._1.ogg', (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers['content-type']);
});
