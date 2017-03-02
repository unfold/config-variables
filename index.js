'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$appJsonPath = _ref.appJsonPath,
      appJsonPath = _ref$appJsonPath === undefined ? _path2.default.join(process.cwd(), 'app.json') : _ref$appJsonPath,
      _ref$dotEnvPath = _ref.dotEnvPath,
      dotEnvPath = _ref$dotEnvPath === undefined ? _path2.default.join(process.cwd(), '.env') : _ref$dotEnvPath,
      _ref$warn = _ref.warn,
      warn = _ref$warn === undefined ? true : _ref$warn,
      _ref$verbose = _ref.verbose,
      verbose = _ref$verbose === undefined ? true : _ref$verbose;

  var appjson = (0, _helpers.readAppjson)(appJsonPath);
  var envConfig = (0, _helpers.readDotEnv)(dotEnvPath);
  var appConfig = (0, _helpers.flattenAppjsonVariables)(appjson);

  var config = _extends({}, appConfig, envConfig);
  (0, _helpers.injectConfig)(config);

  if (warn) {
    (0, _helpers.reportMissingVariables)((0, _helpers.getMissingVariables)(appjson));
  }

  if (verbose) {
    (0, _helpers.reportCurrentConfig)((0, _helpers.getConfigKeys)(appjson, envConfig));
  }
};