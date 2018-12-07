import translate from './translate';
import speech from './speech';

import fs from 'fs';

const translateInput = (req, res) => {
  console.log(req.headers);
  const words = req.query.words;
  if (!Array.isArray(words)) {
    return res.json({ error: 'query must be an array'});
  }
  const wordPromises = words.map(word => {
    return translate.translate(word, 'ig');
  });

  Promise.all(wordPromises).then(values => {
    const translatedWords = { words: values.map(item => item[0]) };
    return res.json(translatedWords);
  })
  .catch(error => {
    return res.state(500).json({
      error,
      errorMessage: error.message
    });
  })
}

const convertSpeech = (req, res) => {
  console.log(req.query);
  console.log(req.params);
  console.log(req.data);
  console.log(req.body);
  // const audioBytes = req.params.audio;
  const audioBytes = fs.readFileSync('src/test/my_audio_file.wav').toString('base64');
  
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 44100,
    languageCode: 'en-US',
  };
  const request = {
    audio,
    config,
  };

  speech.recognize(request).then(response => {
    console.log('Response:', response[0].results);
    const transcription = response[0].results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log('Transcription:', transcription);
    return res.json(transcription);
  })
  .catch((error) => {
    console.log('Error:', error);
    return res.status(500).json({
      error,
      errorMessage: error.message
    }); 
  });
}

export default { translateInput, convertSpeech };