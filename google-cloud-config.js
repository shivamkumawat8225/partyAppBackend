const { Translate } = require('@google-cloud/translate').v2;
const path = require('path');
// Creates a client
const translate = new Translate({
  projectId: 'uplifted-module-451709-k5', // Replace with your Google Cloud project ID
  keyFilename: path.resolve(__dirname, 'uplifted-module-451709-k5-e98c66cf69a2.json')
  // Replace with the path to your service account key file
});

module.exports = translate;