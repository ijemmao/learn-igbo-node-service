import { Translate } from '@google-cloud/translate';
const env = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const projectId = env.project_id;

const translate = new Translate({
  projectId: projectId,
});

const text = 'water';
const target = 'ig';

export default translate;

// translate
//   .translate(text, target)
//   .then(res => {
//     const translation = res[0];
//     console.log('Text: ', text);
//     console.log('Translation: ', translation);
//   })
//   .catch(error => {
//     console.log(error);
//   });
