import axios from 'axios';

const words = ['water', 'time', 'computer'];

axios.get('http://localhost:8080/translate', {
  params: {
    words,
  }
})
  .then((res) => {
    console.log(res.data);
  });