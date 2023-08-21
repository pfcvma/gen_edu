// eslint-disable-next-line @typescript-eslint/no-var-requires
const FormData = require('form-data');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createReadStream } = require('fs');

function requestWithBase64() {
  axios
    .post(
      '', // APIGW Invoke URL
      {
        images: [
          {
            format: '', // file format
            name: '', // image name
            data: '', // image base64 string(only need part of data). Example: base64String.split(',')[1]
          },
        ],
        requestId: '', // unique string
        timestamp: 0,
        version: 'V2',
      },
      {
        headers: {
          'X-OCR-SECRET': '', // Secret Key
        },
      },
    )
    .then((res) => {
      if (res.status === 200) {
        console.log('requestWithBase64 response:', res.data);
      }
    })
    .catch((e) => {
      console.warn('requestWithBase64 error', e.response);
    });
}

function requestWithFile() {
  const file = createReadStream('./textimg.png'); // image file object. Example: fs.createReadStream('./example.png')
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
