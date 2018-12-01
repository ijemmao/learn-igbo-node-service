'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _translate = require('@google-cloud/translate');

var env = process.env.GOOGLE_TRANSLATE_PROJECT_ID;

var projectId = env;

var translate = new _translate.Translate({
  projectId: projectId
});

var text = 'water';
var target = 'ig';

exports.default = translate;
//# sourceMappingURL=translate.js.map