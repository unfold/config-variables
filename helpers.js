'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reportMissingVariables = exports.reportCurrentConfig = exports.getMissingVariables = exports.getConfigKeys = exports.injectConfig = exports.flattenAppjsonVariables = exports.readDotEnv = exports.readAppjson = undefined;

var _isUndefined2 = require('lodash/isUndefined');

var _isUndefined3 = _interopRequireDefault(_isUndefined2);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _attempt2 = require('lodash/attempt');

var _attempt3 = _interopRequireDefault(_attempt2);

var _isError2 = require('lodash/isError');

var _isError3 = _interopRequireDefault(_isError2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readAppjson = exports.readAppjson = function readAppjson(filePath) {
  // eslint-disable-next-line global-require
  var appjson = (0, _attempt3.default)(function () {
    return require(filePath);
  });
  return (0, _isError3.default)(appjson) ? undefined : appjson;
};

var readDotEnv = exports.readDotEnv = function readDotEnv(filePath) {
  var config = (0, _attempt3.default)(function () {
    return _dotenv2.default.parse(_fs2.default.readFileSync(filePath));
  });
  return (0, _isError3.default)(config) ? undefined : config;
};

var flattenAppjsonVariables = exports.flattenAppjsonVariables = function flattenAppjsonVariables() {
  var appjson = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _reduce3.default)(appjson.env, function (variables, variable, name) {
    var value = (0, _isObject3.default)(variable) ? variable.value : variable;

    if (!(0, _isUndefined3.default)(value)) {
      variables[name] = value;
    }

    return variables;
  }, {});
};

var injectConfig = exports.injectConfig = function injectConfig(config) {
  Object.keys(config).forEach(function (name) {
    process.env[name] = process.env[name] || config[name];
  });
};

var getConfigKeys = exports.getConfigKeys = function getConfigKeys(appjson, envConfig) {
  var appEnv = appjson ? appjson.env : {};

  return Object.keys(_extends({}, appEnv, envConfig));
};

var getMissingVariables = exports.getMissingVariables = function getMissingVariables() {
  var appjson = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _reduce3.default)(appjson.env, function (missingVariables, variable, name) {
    if (!(0, _isObject3.default)(variable)) return missingVariables;
    var NODE_ENV = process.env.NODE_ENV || 'development';
    var required = variable.required || variable['required.' + NODE_ENV];
    var missing = !process.env[name];

    if (required && missing) {
      missingVariables.push(_extends({ name: name }, variable));
    }

    return missingVariables;
  }, []);
};

/* eslint-disable no-console */

var print = function print(message, pad, background) {
  var space = background ? _chalk2.default[background](' ') : ' ';

  if (pad) {
    console.log(space + '\n' + space + '   ' + message + '\n' + space);
  } else {
    console.log(space + '   ' + message);
  }
};

var warn = function warn(message, pad) {
  return print(message, pad, 'bgRed');
};

var reportCurrentConfig = exports.reportCurrentConfig = function reportCurrentConfig(keys) {
  if (!keys.length) {
    return;
  }

  var rows = keys.map(function (key) {
    var value = process.env[key] || _chalk2.default.dim('<not set>');

    return _chalk2.default.green(key) + ' = ' + value;
  });

  print('Config variables:', true);
  rows.forEach(function (row) {
    return print(row);
  });
  print('');
};

var reportMissingVariables = exports.reportMissingVariables = function reportMissingVariables(missingVariables) {
  var count = missingVariables.length;

  if (!count) {
    return;
  }

  var rows = missingVariables.map(function (_ref) {
    var name = _ref.name,
        description = _ref.description;

    if (description) {
      return name + ': ' + _chalk2.default.dim(description);
    }
    return name;
  });

  warn('Missing ' + count + ' required variable' + (count > 1 ? 's' : '') + ':', true);
  rows.forEach(function (row) {
    return warn(row);
  });
  warn('Use .env file in root directory to set config variables for development', true);
};

/* eslint-enable no-console */