import axios from 'axios';
import fs from 'fs';
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

let data = JSON.stringify({
  password: 'password',
  username: 'username'
})

// const url = 'http://localhost:8080/speech'


// let strBase64 = 'qwqejfavvasdcoqenorfhhotastastj'
// Axios.post(url, strBase64, { headers: { 'Content-Type': 'text/plain' } })

axios.get('http://localhost:8080/speech/id').then((res) => {
  console.log(res);
})