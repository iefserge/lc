'use strict';
const chalk = require('chalk');

function noColor(v) {
  return v;
}

const colors = {
  objectKey: chalk.magenta,
  number: chalk.blue,
  string: chalk.red,
  regexp: chalk.red,
  boolean: chalk.blue,
  empty: chalk.gray,
  tree: noColor,
  function: chalk.magenta,
  recursive: chalk.red,
  error: noColor
};

function getObjectKeys(obj) {
  const keys = Object.keys(obj);
  if (!Array.isArray(obj)) {
    keys.sort();
  }
  return keys;
}

function colorize(context, value, color) {
  if (!context.colors) {
    return value;
  }

  return color(value);
}

function isObject(value) {
  return Object(value) === value;
}

function objectHasKeys(value) {
  if (!isObject(value)) {
    return false;
  }

  if (isArrayBufferView(value)) {
    return false;
  }

  return Object.keys(value).length > 0;
}

function isDate(value) {
  return isObject(value) && Object.prototype.toString.call(value) === '[object Date]';
}

function isRegExp(value) {
  return isObject(value) && Object.prototype.toString.call(value) === '[object RegExp]';
}

function isError(value) {
  return isObject(value) && (Object.prototype.toString.call(value) === '[object Error]' || value instanceof Error);
}

function isArrayBuffer(value) {
  return isObject(value) && Object.prototype.toString.call(value) === '[object ArrayBuffer]';
}

function isArrayBufferView(value) {
  return ArrayBuffer.isView(value);
}

function indent(level) {
  return ' '.repeat((level + 1) * 2 - 2);
}

function prepareMultilineString(value) {
  return chalk.stripColor(value);
}

function prepareString(value) {
  return prepareMultilineString(value).replace(/\n/g, '\\n');
}

function printKeys(context, value, level) {
  const log = context.log;
  if (level > context.depth) {
    return;
  }

  const keys = getObjectKeys(value);

  if (keys.length === 0) {
    return;
  }

  log('\n');

  const length = Math.max.apply(null, keys.map(key => String(key).length + 1));

  keys.forEach((key, index) => {
    log(indent(level) + colorize(context, objectHasKeys(value[key]) ? '  [+] ' : '    @ ', colors.tree) + colorize(context, key, colors.objectKey) + ': ');
    recursive(context, value[key], level + 1);
    if (index < keys.length - 1) {
      log('\n');
    }
  });
}

function recursive(context, value, level) {
  const log = context.log;
  const seen = context.seen;

  if (value === void 0) {
    log(colorize(context, 'undefined', colors.empty));
    return;
  }

  if (value === null) {
    log(colorize(context, 'null', colors.empty));
    return;
  }

  if (typeof value === 'boolean') {
    log(colorize(context, String(value), colors.boolean));
    return;
  }

  if (typeof value === 'number') {
    log(colorize(context, value, colors.number));
    return;
  }

  if (typeof value === 'string') {
    if (level === 0) {
      log(colorize(context, '"' + prepareMultilineString(value) + '"', colors.string));
      return;
    }

    if (value.length > 80) {
      log(colorize(context, '"' + prepareString(value.slice(0, 75)) + '...', colors.string));
    } else {
      log(colorize(context, '"' + prepareString(value) + '"', colors.string));
    }
    return;
  }

  if (typeof value === 'function') {
    log(colorize(context, 'function', colors.function) + (value.name ? ' ' + value.name : '') + '()');
    printKeys(context, value, level);
    return;
  }

  if (Array.isArray(value)) {
    const ctor = value.constructor ? value.constructor.name : '';
    if (objectHasKeys(value)) {
      if (level === 0) {
        log('[+] ');
      }
      log(ctor + '[' + value.length + '] { ... }');

      if (seen.has(value)) {
        log(colorize(context, ' <-- recursive', colors.recursive));
      } else {
        seen.add(value);
        printKeys(context, value, level);
        seen.delete(value);
      }
    } else {
      log(ctor + '[0]');
    }
    return;
  }

  if (isDate(value)) {
    log(Date.prototype.toUTCString.call(value));
    return;
  }

  if (isRegExp(value)) {
    log(colorize(context, RegExp.prototype.toString.call(value), colors.regexp));
    return;
  }

  if (isError(value)) {
    log(colorize(context, Error.prototype.toString.call(value), colors.error));
    return;
  }

  if (isArrayBuffer(value)) {
    const ctor = value.constructor ? value.constructor.name : '';
    log(ctor + '[' + value.byteLength + ']');
    return;
  }

  if (isArrayBufferView(value)) {
    const ctor = value.constructor ? value.constructor.name : '';
    log(ctor + '[' + value.length + ']');
    return;
  }

  if (isObject(value)) {
    const ctor = value.constructor ? value.constructor.name : '';
    if (objectHasKeys(value)) {
      if (level === 0) {
        log('[+] ');
      }
      if (ctor !== 'Object') {
        log(ctor + ' { ... }');
      } else {
        log('{ ... }');
      }

      if (seen.has(value)) {
        log(colorize(context, ' <-- recursive', colors.recursive));
      } else {
        seen.add(value);
        printKeys(context, value, level);
        seen.delete(value);
      }
    } else {
      if (ctor === 'Object') {
        log('{}');
      } else {
        log(ctor + ' {}');
      }
    }
    return;
  }
}

function lc(context, arr) {
  for (let i = 0; i < arr.length; ++i) {
    const arg = arr[i];
    recursive(context, arg, 0);
  }
}

function dir() {
  let s = '';
  const context = {
    log(v) { s += v; },
    seen: new Set(),
    depth: 2,
    colors: true
  };

  lc(context, arguments);
  console.log(s);
}

function string() {
  let s = '';
  const context = {
    log(v) { s += v; },
    seen: new Set(),
    depth: 2,
    colors: false
  };

  lc(context, arguments);
  return s;
}

dir.string = string;

dir.depth = function(depth) {
  return function() {
    let s = '';
    const context = {
      log(v) { s += v; },
      seen: new Set(),
      depth,
      colors: true
    };

    lc(context, arguments);
    console.log(s);
  };
};

module.exports = dir;
