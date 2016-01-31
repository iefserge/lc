'use strict';
const lc = require('./');

lc({
  key: 'value',
  array: [1, 2, 3],
  other: {
    boolean: true,
    number: 10,
    string: 'hello world',
    date: new Date(Date.UTC(2005, 2, 23)),
    regexp: /[A-Za-z0-9]+/g,
    error: new TypeError('type error message'),
    null: null,
    void: void 0,
    arrayBuffer: new ArrayBuffer(10),
    u8: new Uint8Array([1, 2, 3])
  }
});
