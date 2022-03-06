const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let db;
const url = "mongodb+srv://michael:qP7bDMEL6fVSDLnE@codecorner.tlm8z.mongodb.net/CodeCorner?retryWrites=true&w=majority";

MongoClient.connect(url, (err, client) => {
	if (err) {
		return console.log(err);
	}
	db = client.db("CodeCorner");

	app.listen(process.env.PORT || 8080, () => {

	});
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/makePostPrototype.html');
});

app.post('/submitPost', (req, res) => {	
	db.collection('posts').insertOne(req.body);
});

app.use(express.static('public'));

