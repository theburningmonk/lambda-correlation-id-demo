const log = require('@perform/lambda-powertools-logger')
const wrap = require('@perform/lambda-powertools-pattern-basic')
const http = require('@perform/lambda-powertools-http-client')
const correlationIds = require('@perform/lambda-powertools-correlation-ids')

module.exports.handler = wrap(async (event) => {
  correlationIds.set("character-b", "little finger")

  log.debug("this is a DEBUG log")
  log.info("this is an INFO log")
  log.warn("this is a WARNING log")
  log.error("this is an ERROR log")

  const host = event.headers.Host
  const uri  = `https://${host}/dev/api-c`

  log.info("calling api-c", { uri })

  const reply = await http({
    uri : uri,
    method : 'GET'
  })

  log.info(reply)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Chaos is not a pit. Chaos is a ladder.'
    })    
  }
})