'use strict';

const co         = require('co');
const log        = require('./log');
const reqContext = require('./requestContext');

function parsePayload (record) {
  try {
    let json = new Buffer(record.kinesis.data, 'base64').toString('utf8');
    log.debug('decoded payload:', json);
    
    return JSON.parse(json);
  } catch (err) {
    log.error(`Failed to decode & JSON parse data [${record.kinesis.data}]. Skipped.`);
    return null;
  }
}

function getEvents (records) {
  if (!records || records.length === 0) {
    return [];
  }

  return records
    .map(r => parsePayload(r))
    .filter(p => p !== null && p !== undefined);
}

function setRequestContext (record, context) {
  // this is where the kinesis module (in the same folder) puts it
  let ctx = record.__context;
  delete record.__context;

  ctx.awsRequestId = context.awsRequestId;

  reqContext.replaceAllWith(ctx);  
};

function createKinesisHandler (f) {
  return co.wrap(function* (event, context, cb) {
    console.log(JSON.stringify(event));
    
    try {
      let records = getEvents(event.Records);
      
      // the problem Kinesis events present is that we have to include the
      // correlation IDs as part of the payload of a record, but we receive
      // multiple records on an invocation - so to apply the correct set of
      // correlation IDs in the logs we have to force the handling code to
      // process them one at time so that we can swap out the correlation IDs
      for (let record of records) {
        reqContext.clearAll();

        try {
          setRequestContext(record, context);
        } catch (err) {
          log.warn(`couldn't set current request context: ${err}`, err.stack);
        }

        yield Promise.resolve(f(record, context));
      }

      log.info('SUCCESS');
      cb(null, 'SUCCESS');
    } catch (err) {
      log.error("Failed to process request", err);
      cb(err);
    }
  });
}

module.exports = createKinesisHandler;