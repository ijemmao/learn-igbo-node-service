import axios from 'axios';
import fs from 'fs';
import speech from '@google-cloud/speech';

// Creates a client
const client = new speech.SpeechClient();

const url = 'http://localhost:8080/track/5c0c2757f2dcdba0b0fdd311';

axios({
  responseType: 'arraybuffer', 
  url,
  method: 'GET',
  headers: {
    'Content-Type': 'audio/vnd.wav',
  },
}).then(async(res) => {
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
