const log = require('@perform/lambda-powertools-logger');
const wrap = require('@perform/lambda-powertools-pattern-basic');

module.exports.handler = wrap(async (event) => {
  log.debug("this is a DEBUG log")
  log.info("this is an INFO log")
  log.warn("this is a WARNING log")
  log.error("this is an ERROR log")

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "What's dead may never die."
    })    
  }
})