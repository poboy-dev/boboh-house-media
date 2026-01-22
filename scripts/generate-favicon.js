const pngToIco = require('png-to-ico');
const fs = require('fs');

pngToIco('public/logo.png')
  .then(buf => {
    fs.writeFileSync('public/favicon.ico', buf);
    console.log('favicon.ico generated successfully!');
  })
  .catch(console.error);
