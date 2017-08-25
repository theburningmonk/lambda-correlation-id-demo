'use strict';

const co         = require('co');
const log        = require('../lib/log');
const http       = require('../lib/http');
const apiHandler = require('../lib/apihandler');
const sns        = require('../lib/sns');
const snsTopic   = process.env.snsTopic;

module.exports.handler = apiHandler(
  co.wrap(function* (event, context) {
    log.debug("this is a DEBUG log");
    log.info("this is an INFO log");
    log.warn("this is a WARNING log");
    log.error("this is an ERROR log");

    let host = event.headers.Host;
    let uri  = `https://${host}/dev/api-b`;

    log.info(`calling ${uri}`);

    let reply = yield http({
      uri     : uri,
      method  : 'GET',
      headers : { "x-sender" : "Tyrion" }
    });

    log.info(reply);

    yield sns.publish(snsTopic, "Burn them all");

    return {
      message: 'A Lannister always pays his debts',
      reply: reply
    };
  })
);