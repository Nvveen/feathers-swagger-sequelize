'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var init = module.exports = function () {
  var app = this;
  // Check for swagger
  if (_lodash2.default.isNil(app.docs)) throw new Error('no swagger defined');
  // Iterate over the doc paths, find the service
  (0, _lodash2.default)(app.docs.paths).keys().map(function (path) {
    return { path: path, service: app.service(path) };
  }).filter(function (_ref) {
    var service = _ref.service;
    return _lodash2.default.isObject(service) && !_lodash2.default.isNil(service.Model);
  }).reduce(function (docs, _ref2) {
    var path = _ref2.path,
        service = _ref2.service;

    var name = path.split('/')[1];
    docs.definitions[name + ' list'] = {
      type: 'array',
      items: {
        $ref: '#/definitions/' + name
      }
    };
    docs.tags = _lodash2.default.map(docs.tags, function (t) {
      if (t.name === name && _lodash2.default.has(service, 'Model.options.description')) {
        t.description = service.Model.options.description;
      }
      return t;
    });
    docs.definitions[name] = (0, _lodash2.default)(service.Model.rawAttributes).filter(function (a) {
      return !_lodash2.default.isNil(a.description);
    }).reduce(function (attrs, a) {
      return _lodash2.default.merge(attrs, {
        properties: _defineProperty({}, a.fieldName, {
          type: getType(a.type.key),
          description: a.description
        })
      });
    }, app.docs.definitions[name]);
    return docs;
  }, app.docs);
};

function getType(type) {
  switch (type) {
    case 'STRING':
    case 'CHAR':
    case 'TEXT':
    case 'BLOB':
    case 'DATE':
    case 'DATEONLY':
    case 'TIME':
    case 'NOW':
      return 'string';
    case 'INTEGER':
    case 'BIGINT':
      return 'integer';
    case 'FLOAT':
    case 'DOUBLE':
    case 'DECIMAL':
      return 'number';
    case 'BOOLEAN':
      return 'boolean';
    case 'ARRAY':
      return 'array';
    default:
      return '';
  }
}