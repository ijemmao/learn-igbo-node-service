import translate from './translate';
import speech from './/speech';

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
    return res.json({
      error,
      errorMessage: error.message
    });
  })
}

const convertSpeech = (req, res) => {
  const audioBytes = req.params.audio;
  
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    language: 'en-US',
  };
  const request = {
    audio,
    config,
  };

  speech.recognize(request).then(response => {
    console.log('Response:', response);
    const transcription = [response].results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log('Transcription:', transcription);
    return res.json(transcription);
  })
  .catch((error) => {
    console.log('Error:', error);
    return res.json({
      error,
      errorMessage: error.message
    });
  });
}

export default { translateInput, convertSpeech };