const fs = require('fs');
const request = require('request-promise');
const base64Img = require('base64-img');

const URL = 'http://phancer.com/upload?net=iphone_6';
const SOURCE_DIR = 'sources';
const RESULT_DIR = 'results';


fs.readdirSync(SOURCE_DIR).forEach(filename => {
  const extension = filename.replace(/.*\./, '');
  const option = {
    method: 'POST',
    uri: URL,
    formData: {
      file: {
        value: fs.createReadStream(`${SOURCE_DIR}/${filename}`),
        options: {
          filename: filename,
          contentType: 'image/${extension}'
        }
      }
    },
  };

  request(option)
    .then(res => {
      // console.log(res)
      res = JSON.parse(res);
      base64Img.img(`data:image/${extension};base64,${res.enhanced}`, RESULT_DIR, filename.replace(/\..*/, ''), function (err, filepath) {
        if (err) {
          console.error(`${filename} errored!`);
          return;
        }

        console.log(`${filename} done.`);
      });
    });

});




