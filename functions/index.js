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

app.get('/hi', (req, res) => {
  return res.send("HIHO");
});

app.get('/addCoins/:user/:coins', (req, res) => {
  firestore.collection('users').doc(req.params.user)
    .update({coins: admin.firestore.FieldValue.increment(parseInt(req.params.coins))})
    return res.send(`Added ${req.params.coins} to ${req.params.user}`)
});

app.get('/addAchievement/:user/:achievementName', (req, res) => {
  var achievementName = "achievements." + req.params.achievementName
  firestore.collection('users').doc(req.params.user)
    .update({[achievementName]: true})
    return res.send(`Added ${req.params.achievementName} 
    achievement to ${req.params.user}`)
});

app.get('/checkDaily/:user', (req, res) => {
  firestore.collection('users').doc(req.params.user).get()
  .then((user) => {
    const now = admin.firestore.Timestamp.now().toDate()
    const daily = user.data().daily.toDate()

    if (daily < now) {
      const next_daily = new Date(now.setDate(now.getDate()+1))
      firestore.collection('users').doc(req.params.user)
      .update({
        daily: admin.firestore.Timestamp.fromDate(next_daily),
        coins: admin.firestore.FieldValue.increment(90/parseInt(user.data().tier))
      })
      return res.send(`Has recibido ${90/parseInt(user.data().tier)} monedas`)
    } else {
      return res.send("Ya has recibido daily.")
    }
    
  }).catch((err) => console.log("Error daily", err))
});

app.get('/changeTier/:user/:newTier', (req, res) => {
  firestore.collection('users').doc(req.params.user)
    .update({tier: parseInt(req.params.newTier)})
    return res.send(`Moved ${req.params.user} to tier ${req.params.newTier}`)
});

exports.app = functions.https.onRequest(app);