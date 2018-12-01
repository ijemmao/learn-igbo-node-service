import { Translate } from '@google-cloud/translate';
const env = process.env.GOOGLE_TRANSLATE_PROJECT_ID;

const projectId = env;

const translate = new Translate({
  projectId: projectId,
});

const text = 'water';
const target = 'ig';

export default translate;
