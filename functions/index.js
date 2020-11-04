'use-strict';

const functions = require('firebase-functions');
const admin = require("firebase-admin");
const express = require('express');

const serviceAccount = require("./downhill-dash-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://downhill-dash.firebaseio.com"
});

const firestore = admin.firestore();
const app = express();

app.get('/addcoins/:user/:coins', (req, res) => {
  console.log(req.params);
  console.log(req.params.user);
  console.log(req.params.coins);
  firestore.collection('users').doc(req.params.user)
    .update({coins: admin.firestore.FieldValue.increment(parseInt(req.params.coins))})
});

app.get('/hi', (req, res) => {
  return res.send("HIHO");
});

exports.app = functions.https.onRequest(app);