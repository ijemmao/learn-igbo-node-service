import express from 'express';
import actions from './actions/actions';
import './actions/firebase';
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to the Learn Igbo API');
});

app.get('/translate', (req, res) => {
  actions.translateInput(req, res);
});

app.get('/speech/:id', (req, res) => {
  actions.convertSpeech(req, res);
});

app.listen(process.env.PORT || 8080);