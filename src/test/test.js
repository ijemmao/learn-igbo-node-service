import axios from 'axios';
import fs from 'fs';
import speech from '@google-cloud/speech';

// Creates a client
const client = new speech.SpeechClient();


// const words = ['water', 'time', 'computer'];

// axios.get('http://learn-igbo.herokuapp.com/translate', {
//   params: {
//     words,
//   },
// })
//   .then((res) => {
//     console.log(res.data);
//   });

const url = 'http://localhost:8080/track/5c0c2757f2dcdba0b0fdd311';

// axios.get('http://localhost:8080/track/5c0c2757f2dcdba0b0fdd311').then((res) => {
//   const outputFilename = '/uploads/recording.mp3';
//   fs.writeFileSync(outputFilename, res.data);
//   console.log(res);
// })

axios({
  responseType: 'arraybuffer',
  url,
  method: 'GET',
  headers: {
    'Content-Type': 'audio/vnd.wav',
  },
}).then((res) => {
  const audioBytes = res.data.toString('base64');
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 44100,
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

})
