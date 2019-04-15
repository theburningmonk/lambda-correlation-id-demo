const log            = require('../lib/log');
const kinesisHandler = require('../lib/kinesisHandler');
const http           = require('../lib/http');
const reqContext     = require('../lib/requestContext');

// the KinesisHandler abstraction takes in a function that processes one
// record at a time so to allow us to inject the correlation IDs that
// corresponds to each record
module.exports.handler = kinesisHandler(
  async (record, context) => {
    reqContext.set("source-type", "kinesis");

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