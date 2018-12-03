import fs from 'fs';
import readline from 'readline';
import Noun from './../models/noun';

var rd = readline.createInterface({
  input: fs.createReadStream('/Users/IjemmaOnwuzulike 1/Documents/learn-igbo/assets/data/igbo_nouns.txt', 'utf8'),
  console: false
});


async function saveInDatabase() {
  console.log('info')
  rd.on('line', async(line) => {
    const splitLine = line.split('&');
    const english = splitLine[0].trim();
    const igbo = splitLine[1];
    
    if (igbo && english) {
      let noun = new Noun({ english, igbo });
      await noun.save();
    }
  });
}

export default saveInDatabase;

