'use strict';

const log        = require('../lib/log');
const snsHandler = require('../lib/snshandler');

module.exports.handler = snsHandler((event, context) => {
  log.debug("this is a DEBUG log");
  log.info("this is an INFO log");
  log.warn("this is a WARNING log");
  log.error("this is an ERROR log");
});