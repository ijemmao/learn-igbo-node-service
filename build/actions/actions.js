'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _translate = require('./translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var translateInput = function translateInput(req, res) {
  console.log(req.headers);
  var words = req.query.words;
  if (!Array.isArray(words)) {
    return res.json({ error: 'query must be an array' });
  }
  var wordPromises = words.map(function (word) {
    return _translate2.default.translate(word, 'ig');
  });

  Promise.all(wordPromises).then(function (values) {
    var translatedWords = { words: values.map(function (item) {
        return item[0];
      }) };
    return res.json(translatedWords);
  }).catch(function (error) {
    return res.json({
      error: 'there was an error translating the input',
      errorMessage: error.message
    });
  });
};

exports.default = { translateInput: translateInput };
//# sourceMappingURL=actions.js.map