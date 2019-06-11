const log = require('@perform/lambda-powertools-logger')
const wrap = require('@perform/lambda-powertools-pattern-basic')
const http = require('@perform/lambda-powertools-http-client')

module.exports.handler = wrap(async (event, context) => {
  const events = context.parsedKinesisEvents

  // you can safely process events in parallel
  await Promise.all(events.map(async evt => {
    // event has a `logger` attached to it, with the specific correlation IDs for that record
    evt.logger.debug('handling kinesis event', { event: evt })

    // each event has its own correlation Ids as well
    evt.correlationIds.set("source-type", "kinesis")

    log.debug("this is a DEBUG log")
    log.info("this is an INFO log")
    log.warn("this is a WARNING log")
    log.error("this is an ERROR log")

    const host = evt.correlationIds.get()["x-correlation-host"]
    if (host) {
      const uri  = `https://${host}/dev/api-c`
      
      log.info("calling api-c", { uri })
    
      // pass in the correlation IDs for just this event
      const reply = await http({
        uri : uri,
        method : 'GET',
        correlationIds: evt.correlationIds
      })
    
      log.info(reply)
    }
  }))
})