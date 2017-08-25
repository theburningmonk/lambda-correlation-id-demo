'use strict';

let clearAll = () => global.CONTEXT = undefined;

let replaceAllWith = ctx => global.CONTEXT = ctx;

let set = (key, value) => {
  if (!global.CONTEXT) {
    global.CONTEXT = {};
  }

  global.CONTEXT[key] = value;
};

let get = () => global.CONTEXT || {};

module.exports = {
  clearAll,
  replaceAllWith,
  set: set,
  get: get
};