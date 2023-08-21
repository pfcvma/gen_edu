import axios from 'axios';
import FormData = require('form-data');
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { createReadStream } from 'node:fs';

function parseTextFromOcr(fields: Array<object>): string {
  let text: string = '';
  for (let i = 0; i < fields.length; i++) {
    text += fields[i]['inferText'] + ' ';
    if (fields[i]['lineBreak'] === true) text += '\n';
  }
  return text;
}

function requestWithBase64(file: Express.Multer.File) {
  const imgInfo = path.parse(file.originalname);
  const imgBuffer = file.buffer;
  axios
    .post(
      'https://z2nh2vrzxc.apigw.ntruss.com/custom/v1/23377/4bf95343d7cdb272f089e07b714264b3c2da5ad5922d02c4d83f35918ae06688/general', // APIGW Invoke URL
      {
        images: [
          {
            format: imgInfo.ext, // file format
            name: imgInfo.name, // image name
            data: imgBuffer.toString('base64'), // image base64 string(only need part of data). Example: base64String.split(',')[1]
          },
        ],
        requestId: uuidv4(), // unique string
        timestamp: 0,
        version: 'V2',
      },
      {
        headers: {
          'X-OCR-SECRET': 'YnhWaXF3SmNGbnVSbWdXbWd6blJCT1pPY0F6QmxQQ3A=', // Secret Key
        },
      },
    )
    .then((res) => {
      if (res.status === 200) {
        console.log('requestWithBase64 response:', res.data);
        return parseTextFromOcr(res.data.images[0].fields);
      }
    })
    .catch((e) => {
      console.warn('requestWithBase64 error', e.response);
      //에러처리 해줘야됨
    });
}
function requestWithFile() {

  // const imgInfo = path.parse(file2.originalname);
  // const imgBuffer = file2.buffer;
  // const readStream = new Readable();
  // readStream.push(imgBuffer);
  // readStream.push(null);
  // const file = readStream; // image file object. Example: fs.createReadStream('./example.png')
  const file = createReadStream('/Users/koomin/Downloads/textimg.png');
  const message = {
    images: [
      {
        format: 'png', // file format
        name: 'textimg', // file name
      },
    ],
    requestId: '123', // unique string
    timestamp: 0,
    version: 'V2',
  };
  const formData = new FormData();

  formData.append('file', file);
  formData.append('message', JSON.stringify(message));

  axios
    .post(
      'https://z2nh2vrzxc.apigw.ntruss.com/custom/v1/23377/4bf95343d7cdb272f089e07b714264b3c2da5ad5922d02c4d83f35918ae06688/general', // APIGW Invoke URL
      formData,
      {
        headers: {
          'X-OCR-SECRET': 'YnhWaXF3SmNGbnVSbWdXbWd6blJCT1pPY0F6QmxQQ3A=', // Secret Key
          ...formData.getHeaders(),
        },
      },
    )
    .then((res) => {
      if (res.status === 200) {
        console.log('requestWithFile response:', res.data);
      }
    })
    .catch((e) => {
      console.warn('requestWithFile error', e.response);
    });
}
requestWithFile();
