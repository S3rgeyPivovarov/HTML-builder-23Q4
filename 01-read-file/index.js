const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath);

readStream.on('data', (chunk) => {
  console.log(String(chunk));
});
readStream.on('error', (err) => console.log(String(err)));
