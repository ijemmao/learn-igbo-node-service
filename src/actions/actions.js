import admin from './firebase';
import translate from './translate';
import speech from './speech';

const database = admin.database();
const bucket = admin.storage().bucket('learn-igbo');

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


  // storage.ref().child('audio').getDownloadURL().then((url) => {
  //   axios.get(url).then((res) => {
  //     console.log(res);
  //   })
  // })
  // .catch((error) => {
  //   res.status(500).json({ error });
  // })


  // database.ref(`/audio/${req.params.id}`).once('value')
  // .then((snapshot) => {
  //   const audioBytes = snapshot.val();
  //   const audio = {
  //     content: audioBytes,
  //   };
  //   const config = {
  //     encoding: 'LINEAR16',
  //     sampleRateHertz: 44100,
  //     languageCode: 'en-US',
  //   };
  //   const request = {
  //     audio,
  //     config,
  //   };
  //   speech.recognize(request).then(response => {
  //     const transcription = response[0].results
  //       .map(result => result.alternatives[0].transcript)
  //       .join('\n');
  //     console.log('Transcription:', transcription);
  //     return res.json(transcription);
  //   })
  //   .catch((error) => {
  //     console.log('Error:', error);
  //     return res.status(500).json({
  //       error,
  //       errorMessage: error.message
  //     }); 
  //   });
  // })

}

export default { translateInput, convertSpeech };