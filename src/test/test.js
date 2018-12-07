import axios from 'axios';
import querystring from 'querystring';
import fs from 'fs';
import { URLSearchParams } from 'url';
global.URLSearchParams = URLSearchParams;
const content = fs.readFileSync('./my_audio_file.wav');

// const words = ['water', 'time', 'computer'];

// axios.get('http://learn-igbo.herokuapp.com/translate', {
//   params: {
//     words,
//   },
// })
//   .then((res) => {
//     console.log(res.data);
//   });

// axios.post('http://localhost:8080/speech', { time: 'time' }).then((result) => {
//   console.log(result.config.data)
// })

const params = new URLSearchParams();
params.append('item', 'item');

const options = {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  data: querystring.stringify({ ijemma: 'time' }),
  body: { ijemma: 'onwkokokokuzulike '},
  params: querystring.stringify({ ijemma: content }),
  url: 'http://localhost:8080/speech',
};
axios(options);