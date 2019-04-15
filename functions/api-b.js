const log        = require('../lib/log');
const apiHandler = require('../lib/apiHandler');
const http       = require('../lib/http');
const reqContext = require('../lib/requestContext');

module.exports.handler = apiHandler(
  async (event, context) => {
    reqContext.set("character-b", "little finger");

    log.debug("this is a DEBUG log");
    log.info("this is an INFO log");
    log.warn("this is a WARNING log");
    log.error("this is an ERROR log");

    let host = event.headers.Host;
    let uri  = `https://${host}/dev/api-c`;

    log.info("calling api-c", { uri });

    let reply = await http({
      uri     : uri,
      method  : 'GET'
    });

    log.info(reply);

    return {
      message: 'Chaos is not a pit. Chaos is a ladder.'
    };
  });