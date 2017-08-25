'use strict';

const co         = require('co');
const log        = require('./log');
const reqContext = require('./requestContext');

function setRequestContext (event, context) {
  let ctx = { awsRequestId : context.awsRequestId };
  let snsRecord = event.Records[0].Sns;
  let msgAttributes = snsRecord.MessageAttributes;
  
  for (var msgAttribute in msgAttributes) {
    if (msgAttribute.toLowerCase().startsWith("x-correlation-")) {
      ctx[msgAttribute] = msgAttributes[msgAttribute].Value
    }

    if (msgAttribute === "User-Agent") {
      ctx["User-Agent"] = msgAttributes["User-Agent"].Value;
    }

    if (msgAttribute === "Debug-Log-Enabled") {
      ctx["Debug-Log-Enabled"] = msgAttributes["Debug-Log-Enabled"].Value;
    }
  }
 
  if (!ctx["x-correlation-id"]) {
    ctx["x-correlation-id"] = ctx.awsRequestId;
  }

  if (!ctx["Debug-Log-Enabled"]) {
    // enable debug logging on 5% of cases
    ctx["Debug-Log-Enabled"] = Math.random() < 0.05 ? "true" : "false";
  }

  reqContext.replaceAllWith(ctx);
};

function createSnsHandler (f) {  
  return co.wrap(function* (event, context, cb) {
    console.log(JSON.stringify(event));

    reqContext.clearAll();

    try {
      setRequestContext(event, context);
    } catch (err) {
      log.warn(`couldn't set current request context: ${err}`, err.stack);
    }

    try {
      let result = yield Promise.resolve(f(event, context));
      result = result || {};
      
      log.info('SUCCESS', JSON.stringify(result));
      cb(null, JSON.stringify(result));
    } catch (err) {
      log.error("Failed to process request", err);
      cb(err);
    }
  });
}

module.exports = createSnsHandler;