'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _actions = require('./actions/actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.get('/', function (res) {
  res.send('Welcome to the Learn Igbo API');
});

app.get('/translate', function (req, res) {
  _actions2.default.translateInput(req, res);
});

app.listen(process.env.PORT || 8080);
//# sourceMappingURL=server.js.map