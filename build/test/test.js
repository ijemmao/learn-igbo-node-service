'use strict';

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var words = ['water', 'time', 'computer'];

_axios2.default.get('http://localhost:8080/translate', {
  params: {
    words: words
  }
}).then(function (res) {
  console.log(res.data);
});
//# sourceMappingURL=test.js.map