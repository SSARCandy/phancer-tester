const {readdirSync, createReadStream} = require('fs');
const request = require('request-promise');
const base64Img = require('base64-img');

const URL = 'http://phancer.com/upload';
const MODELS = ['iphone_6', 'iphone_7', 'nexus_5x'];
const SOURCE_DIR = 'sources';
const RESULT_DIR = 'results';

const model = process.argv[2] || 'iphone_6';
console.log(`Selected net = ${model}`);
if (!~MODELS.indexOf(model)) {
  console.error(`Please select one of models: ${MODELS}`);
  return;
}

readdirSync(SOURCE_DIR).forEach(filename => {
  const extension = filename.replace(/.*\./, '');
  const option = {
    method: 'POST',
    uri: `${URL}?net=${model}`,
    formData: {
      file: {
        value: createReadStream(`${SOURCE_DIR}/${filename}`),
        options: {
          filename: filename,
          contentType: `image/${extension}`
        }
      }
    },
  };

  request(option)
    .then(res => {
      res = JSON.parse(res);
      const enhanced_filename = `${filename.replace(/\..*/, '')}-${model}`;
      base64Img.img(`data:image/${extension};base64,${res.enhanced}`, RESULT_DIR, enhanced_filename, (err, filepath) => {
        if (err) {
          console.error(`${filepath} errored!`);
          return;
        }

        console.log(`${filepath} done.`);
      });
    });

});




