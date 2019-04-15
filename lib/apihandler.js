const log        = require('./log');
const reqContext = require('./requestContext');

function setRequestContext (event, context) {
  if (!event.headers) {
   log.warn(`Request ${context.awsRequestId} is missing headers`);
   return;
  } 

  let ctx = { awsRequestId : context.awsRequestId };
  for (var header in event.headers) {
    if (header.toLowerCase().startsWith("x-correlation-")) {
      ctx[header] = event.headers[header]
    }
  }
 
  if (!ctx["x-correlation-id"]) {
    ctx["x-correlation-id"] = ctx.awsRequestId;
  }

  if (event.headers["User-Agent"]) {
    ctx["User-Agent"] = event.headers["User-Agent"]; 
  }

  if (event.headers["Debug-Log-Enabled"] === 'true') {
    ctx["Debug-Log-Enabled"] = "true"
  } else {
    // enable debug logging on 5% of cases
    ctx["Debug-Log-Enabled"] = Math.random() < 0.05 ? "true" : "false";
  }

  reqContext.replaceAllWith(ctx);
};

function OK (result) {
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};

function createApiHandler (f) {  
  return async (event, context) => {
    console.log(JSON.stringify(event));

    reqContext.clearAll();

    try {
      setRequestContext(event, context);
    } catch (err) {
      log.warn(`couldn't set current request context: ${err}`, err.stack);
    }

    try {  
      let result = await Promise.resolve(f(event, context));
      result = result || {};

      log.info('SUCCESS', JSON.stringify(result));
      OK(result);
    } catch (err) {
      log.error("Failed to process request", err);
      throw err;
    }
  };
}

module.exports = createApiHandler;