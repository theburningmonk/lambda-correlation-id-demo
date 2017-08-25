'use strict';

const log        = require('../lib/log');
const apiHandler = require('../lib/apihandler');

module.exports.handler = apiHandler((event, context) => {
  console.log(JSON.stringify(event));

  log.debug("this is a DEBUG log");
  log.info("this is an INFO log");
  log.warn("this is a WARNING log");
  log.error("this is an ERROR log");

  return {
    message: 'Chaos is not a pit. Chaos is a ladder.'
  };
});