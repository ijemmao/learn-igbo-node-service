import express from 'express';
import mongoose from 'mongoose';
import actions from './actions/actions';
import saveInDatabase from './actions/populate-database';
const app = express();
const mongoDB = 'mongodb://127.0.0.1:27017/learn-igbo';

mongoose.connect(mongoDB)
.then(() => {
  console.log('connection successful');
  saveInDatabase();
})
.catch((error) => console.error(error));
mongoose.Promise = global.Promise;


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
  res.send('Welcome to the Learn Igbo API');
});

app.get('/translate', (req, res) => {
  actions.translateInput(req, res);
});

app.listen(process.env.PORT || 8080);