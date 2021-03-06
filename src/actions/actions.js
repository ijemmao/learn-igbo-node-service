import mongodb from 'mongodb';
import multer from 'multer';
import { Readable } from 'stream';
import axios from 'axios';
import fs from 'fs';
import admin from './firebase';
import translate from './translate';
import speech from '@google-cloud/speech';
import { isArray } from 'util';

const database = admin.database();
const ObjectID = mongodb.ObjectID;
const client = new speech.SpeechClient();

const translateInput = (req, res) => {
  console.log(req.query);
  const words = req.query.words;
  let response = {};

  if (Array.isArray(words)) {
    // just passing in words
    const wordsSet = new Set(words);

    const wordPromises = Array.from(wordsSet).map(word => {
      return translate.translate(word, 'ig');
    })

    Promise.all(wordPromises).then(values => {
      response['words'] = values.map(item => item[0])
      return res.json(response);
    })
    .catch(error => {
      return res.state(500).json({
        error,
        errorMessage: error.message
      });
    })
  } else {
    translate.translate(words, 'ig').then((result) => {

      // translate the entire sentence
      response['sentence'] = result[0]

      // translate individual words
      const wordsSet = new Set(words.split(' '));

      const wordPromises = Array.from(wordsSet).map(word => {
        return translate.translate(word, 'ig');
      });

      Promise.all(wordPromises).then(values => {
        response['words'] = values.map(item => item[0])
        return res.json(response);
      })
    })
    .catch(error => {
      return res.state(500).json({
        error,
        errorMessage: error.message
      });
    })
  }
  
  
}

const uploadAudio = (req, res, database) => {
  const name = req.body.name;
  const storage = multer.memoryStorage();
  const upload = multer({ storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 } });

  upload.single('track')(req, res, async(err) => {
    if (err) {
      return res.status(400).json({ message: "Upload Request Validation Failed" });
    } else if (!name) {
      return res.status(400).json({ message: "No track name in request body" });
    }

    let trackName = name;

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
      return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id, id });
    });

  })
}

const downloadAudio = (req, res, database) => {
  try {
    var id = new ObjectID(req.params.id);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Invalid id in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" });
  }
  res.set('content-type', 'audio/wav');
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
}

const convertSpeech = (req, og_res) => {
  const client = new speech.SpeechClient();

  let url = process.env.APP_URI || 'http://localhost:8080'
  url +=  `/audio/${req.params.id}`;

  axios({
    responseType: 'arraybuffer',
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'audio/vnd.wav',
    },
  }).then(async (res) => {
    const audioBytes = res.data.toString('base64');
    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    const request = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(response);
    console.log(`Transcription: ${transcription}`);

    og_res.json(transcription);

  })
    .catch((error) => {
      console.log(error);
    })
}

export default { translateInput, convertSpeech, uploadAudio, downloadAudio };