# lc
"Lemme see" (lc) object inspector. Displays hierarchical listing of an object. Requires Node 4.0 or later.

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

/*
[+] { ... }
  [+] array: Array[3] { ... }
      @ 0: 1
      @ 1: 2
      @ 2: 3
    @ key: "value"
  [+] other: { ... }
      @ arrayBuffer: ArrayBuffer[10]
      @ boolean: true
      @ date: Wed Mar 23 2005 00:00:00 GMT+0200 (EET)
      @ error: TypeError: some type error
      @ null: null
      @ number: 10
      @ regexp: /[A-Za-z0-9]+/g
      @ string: "hello world"
      @ u8: Uint8Array[3]
      @ undefined: undefined
*/
```

### License

MIT
