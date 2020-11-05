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

app.get('/addCoins/:userName/:coins', (req, res) => {
	firestore.collection('users').doc(req.params.userName)
		.update({coins: admin.firestore.FieldValue.increment(parseInt(req.params.coins))})
	return res.send(`Added ${req.params.coins} to ${req.params.userName}`)
});

app.get('/addAchievement/:userName/:achievementName', (req, res) => {
	var achievementName = "achievements." + req.params.achievementName
	firestore.collection('users').doc(req.params.userName)
		.update({[achievementName]: true})
	return res.send(`Added ${req.params.achievementName} 
		achievement to ${req.params.userName}`)
});

app.get('/checkDaily/:userName', (req, res) => {
	firestore.collection('users').doc(req.params.userName).get()
	.then((user) => {
		const now = admin.firestore.Timestamp.now().toDate()
		const daily = user.data().daily.toDate()

		if (daily < now) {
			const next_daily = new Date(now.setDate(now.getDate()+1))
			firestore.collection('users').doc(req.params.userName)
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

app.get('/changeTrackTime/:userName/:trackOwner/:trackName/:time', (req, res) => {
	const { userName, trackOwner, trackName, time } = req.params
	firestore.collection('users').doc(userName).get()
	.then((user) => {
		if (parseFloat(time) < user.data().times[trackOwner][trackName]) {
			const trackPath = "times." + trackOwner + "." + trackName
			firestore.collection('users').doc(userName)
				.update({[trackPath]: parseInt(time)})
			return res.send(`${userName} hizo un nuevo recprd de ${time}s 
				en ${trackName} de ${trackOwner}.`)
		} else {
		return res.send("No es un record.")
		}
	}).catch((err) => console.log("Error track time", err));
});

exports.app = functions.https.onRequest(app);