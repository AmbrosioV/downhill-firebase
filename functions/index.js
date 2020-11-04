'use-strict';

const functions = require('firebase-functions');
const admin = require("firebase-admin");
const express = require('express');

const serviceAccount = require("./downhill-dash-firebase-adminsdk.json");

firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://downhill-dash.firebaseio.com"
});

const firestore = firebaseApp.firestore();
const app = express();

app.get('/addcoins/:user/:coins', (req, res) => {
  firestore.collection('users').doc(req.params.user)
    .update({coins: admin.firestore.FieldValue.increment(parseInt(req.params.coins))})
    return res.send("Added ${req.params.coins} to ${req.params.user}")
});

app.get('/addAchievement/:user/:achievementName', (req, res) => {
  var ach = "achievements." + req.params.achievementName
  firestore.collection('users').doc(req.params.user)
    .update({[ach]: true})
    return res.send(`Added ${req.params.achievementName} 
    achievement to ${req.params.user}`)
});

app.get('/hi', (req, res) => {
  return res.send("HIHO");
});

exports.app = functions.https.onRequest(app);