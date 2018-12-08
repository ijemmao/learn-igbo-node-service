import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import actions from './actions/actions';
import './actions/firebase';

const app = express();
const mongoDB = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learn-igbo';
// const upload = multer({ dest: 'uploads/' });
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

let database;
mongoose.connect(mongoDB)
  .then((res) => {
    database = res.connections[0].db;
  })
  .catch((error) => console.error(error));
mongoose.Promise = global.Promise;


app.get('/', (req, res) => {
  res.send('Welcome to the Learn Igbo API');
});

app.get('/translate', (req, res) => {
  actions.translateInput(req, res);
});

app.get('/speech/:id', (req, res) => {
  actions.convertSpeech(req, res);
});

app.get('/track/:id', (req, res) => {
  actions.downloadAudio(req, res, database);
});

app.post('/track', upload.single('track'), (req, res) => {
  actions.uploadAudio(req, res, database);
})

app.listen(process.env.PORT || 8080);