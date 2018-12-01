import axios from 'axios';

const words = ['water', 'time', 'computer'];

axios.get('http://learn-igbo.herokuapp.com/translate', {
  params: {
    words,
  },
  key: 'AIzaSyDCkvbIaUd2dguYB4LmpW0lq9_kUCfFC9k',
})
  .then((res) => {
    console.log(res.data);
  });