'use strict';
var lc = require('./');
var test = require('tape');

test('basic', t => {
  var value = lc.string({
    key: 'value',
    array: [1, 2, 3],
    other: {
      boolean: true,
      number: 10,
      string: 'hello world',
      date: new Date(2005, 2, 23),
      regexp: /[A-Za-z0-9]+/g,
      error: new TypeError('type error message'),
      null: null,
      void: void 0,
      arrayBuffer: new ArrayBuffer(10),
      u8: new Uint8Array([1, 2, 3])
    }
  });

  t.equal(value,
`[+] { ... }
  [+] array: Array[3] { ... }
      @ 0: 1
      @ 1: 2
      @ 2: 3
    @ key: "value"
  [+] other: { ... }
      @ arrayBuffer: ArrayBuffer[10]
      @ boolean: true
      @ date: Wed Mar 23 2005 00:00:00 GMT+0200 (EET)
      @ error: TypeError: type error message
      @ null: null
      @ number: 10
      @ regexp: /[A-Za-z0-9]+/g
      @ string: "hello world"
      @ u8: Uint8Array[3]
      @ void: undefined`
);
  t.end();
});

test('recursive', t => {
  var obj = {
    obj1: null,
    obj2: {},
    obj3: null
  };

  obj.obj3 = obj;

  var value = lc.string(obj);
  t.equal(value,
`[+] { ... }
    @ obj1: null
    @ obj2: {}
  [+] obj3: { ... } <-- recursive`);
  t.end();
});

test('full long multiline string at depth 0', t => {
  var value = lc.string(
    'this is very long string this is very long string ' +
    'this is very long string this is very long string ' +
    'this is very long string this is very long string ' +
    'this is very long string this is very long string\n' +
    'second line\n' +
    'third line');

  t.equal(value,
    '"this is very long string this is very long string ' +
    'this is very long string this is very long string ' +
    'this is very long string this is very long string ' +
    'this is very long string this is very long string\n' +
    'second line\n' +
    'third line"');
  t.end();
});

test('shortened long multiline string at depth 1', t => {
  var str = 'this is very long string this is very long string ' +
    'this is very long string this is very long string ' +
    'this is very long string this is very long string ' +
    'this is very long string this is very long string\n' +
    'second line\n' +
    'third line';
  var value = lc.string({
    value: str
  });

  t.equal(value,
`[+] { ... }
    @ value: "this is very long string this is very long string this is very long string ...`);
  t.end();
});

test('array depth 0', t => {
  var value = lc.string([1, 2, 3, 4, 5]);
  t.equal(value,
`[+] Array[5] { ... }
    @ 0: 1
    @ 1: 2
    @ 2: 3
    @ 3: 4
    @ 4: 5`);
  t.end();
});
