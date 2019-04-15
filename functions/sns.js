const log        = require('../lib/log');
const snsHandler = require('../lib/snsHandler');
const http       = require('../lib/http');
const reqContext = require('../lib/requestContext');

module.exports.handler = snsHandler(
  async (event, context) => {
    reqContext.set("source-type", "sns");

    log.debug("this is a DEBUG log");
    log.info("this is an INFO log");
    log.warn("this is a WARNING log");
    log.error("this is an ERROR log");

    let host = reqContext.get()["x-correlation-host"];
    if (host) {
      let uri  = `https://${host}/dev/api-c`;
      
      log.info("calling api-c", { uri });
    
      let reply = await http({
        uri     : uri,
        method  : 'GET'
      });
    
      log.info(reply);
    }  
  });