"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parsePrettier;

var _path = _interopRequireDefault(require("path"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parsePrettier(content, filepath) {
  const filename = _path.default.basename(filepath);

  if (filename === 'package.json') {
    const config = (0, _utils.readJSON)(filepath);

    if (config && config.prettier && typeof config.prettier === 'string') {
      return [config.prettier];
    }
  }

  return [];
}

module.exports = exports.default;