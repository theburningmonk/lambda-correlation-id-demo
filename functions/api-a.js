const log        = require('../lib/log');
const http       = require('../lib/http');
const apiHandler = require('../lib/apiHandler');
const sns        = require('../lib/sns');
const kinesis    = require('../lib/kinesis');
const reqContext = require('../lib/requestContext');
const snsTopic   = process.env.snsTopic;
const streamName = process.env.streamName;

module.exports.handler = apiHandler(
  async (event, context) => {
    reqContext.set("character-a", "tywin");

    log.debug("this is a DEBUG log");
    log.info("this is an INFO log");
    log.warn("this is a WARNING log");
    log.error("this is an ERROR log");

    let host = event.headers.Host;
    reqContext.set("host", host);
    let uri  = `https://${host}/dev/api-b`;

    log.info("calling api-b", { uri });

    let reply = await http({
      uri     : uri,
      method  : 'GET'
    });

    log.info(reply);

    await sns.publish(snsTopic, "Burn them all");

    log.info("published SNS message", { snsTopic });

    let kinesisRecord = { 
      message: 'You are no son of mine'
    };
    await kinesis.putRecord(streamName, "partition-key", kinesisRecord);

    log.info("published Kinesis event", { streamName });

    return {
      message: 'A Lannister always pays his debts',
      reply: reply
    };
  });