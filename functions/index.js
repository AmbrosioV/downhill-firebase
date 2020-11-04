const functions = require('firebase-functions');
var admin = require("firebase-admin");

var serviceAccount = require("downhill-dash-firebase-adminsdk.json");

var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://downhill-dash.firebaseio.com"
});


exports.hello = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
