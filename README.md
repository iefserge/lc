# lc
"Lemme see" (lc) object inspector. Displays hierarchical listing of an object. Requires Node 4.0 or later.

[![Build Status](https://travis-ci.org/iefserge/lc.svg?branch=master)](https://travis-ci.org/iefserge/lc)

### Installation

```
npm install -g lc
```

### Usage

```js
const lc = require('lc');
const obj = {
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
};

lc(obj);
```

![](https://raw.githubusercontent.com/iefserge/lc/master/img/s1.png)

### License

MIT
