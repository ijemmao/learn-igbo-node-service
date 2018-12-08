import express from 'express';
import mongodb from 'mongodb';
import mongoose from 'mongoose';
import multer from 'multer';
import { Readable } from 'stream';
import actions from './actions/actions';
import './actions/firebase';

const app = express();
const mongoDB = 'mongodb://127.0.0.1:27017/learn-igbo';
const ObjectID = mongodb.ObjectID;

let database;
mongoose.connect(mongoDB)
  .then((res) => {
    console.log('connection successful');
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
  try {
    var id = new ObjectID(req.params.id);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Invalid id in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" });
  }
  res.set('content-type', 'audio/mp3');
  res.set('accept-ranges', 'bytes');

  let bucket = new mongodb.GridFSBucket(database, {
    bucketName: 'tracks'
  });

  let downloadStream = bucket.openDownloadStream(id);

  downloadStream.on('data', (chunk) => {
    res.write(chunk);
  });

  downloadStream.on('error', () => {
    res.sendStatus(404);
  });

  downloadStream.on('end', () => {
    res.end();
  });
});

app.post('/track', (req, res) => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }});

  upload.single('track')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "Upload Request Validation Failed" });
    } else if (!req.body.name) {
      return res.status(400).json({ message: "No track name in request body" });
    }

    let trackName = req.body.name;

    // Covert buffer to Readable Stream
    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    let bucket = new mongodb.GridFSBucket(database, {
      bucketName: 'tracks'
    });

    let uploadStream = bucket.openUploadStream(trackName);
    let id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);

    uploadStream.on('error', () => {
      return res.status(500).json({ message: "Error uploading file" });
    });

    uploadStream.on('finish', () => {
      return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id });
    });

  })
})

app.listen(process.env.PORT || 8080);