import axios from 'axios';

const words = ['water', 'time', 'computer'];

axios.get('http://learn-igbo.herokuapp.com/translate', {
  params: {
    words,
  },
})
  .then((res) => {
    console.log(res.data);
  });