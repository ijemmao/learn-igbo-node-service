import translate from './translate';

const translateInput = (req, res) => {
  console.log(req.headers);
  const words = req.query.words;
  if (!Array.isArray(words)) {
    return res.json({ error: 'query must be an array'});
  }
  const wordPromises = words.map(word => {
    return translate.translate(word, 'ig');
  });

  Promise.all(wordPromises).then(values => {
    const translatedWords = { words: values.map(item => item[0]) };
    return res.json(translatedWords);
  })
  .catch(error => {
    return res.json({
      error,
      errorMessage: error.message
    });
  })
}

export default { translateInput };