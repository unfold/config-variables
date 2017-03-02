'use strict';

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  Automatically reads, applies and report missing variables on require
//
//  Example in npm script:
//  "start": "node -r config-variables ./src/app.js"
//
//  Example in entry file:
//  import 'config-variables'

(0, _index2.default)();