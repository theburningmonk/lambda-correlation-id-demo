const log = require('@perform/lambda-powertools-logger')
const http = require('@perform/lambda-powertools-http-client')
const wrap = require('@perform/lambda-powertools-pattern-basic')
const sns = require('@perform/lambda-powertools-sns-client')
const kinesis = require('@perform/lambda-powertools-kinesis-client')
const correlationIds = require('@perform/lambda-powertools-correlation-ids')
const snsTopic   = process.env.snsTopic
const streamName = process.env.streamName

module.exports.handler = wrap(async (event) => {
  correlationIds.set("character-a", "tywin")

  log.debug("this is a DEBUG log")
  log.info("this is an INFO log")
  log.warn("this is a WARNING log")
  log.error("this is an ERROR log")

  const host = event.headers.Host
  correlationIds.set("host", host)
  const uri  = `https://${host}/dev/api-b`

  log.info("calling api-b", { uri })

  const reply = await http({
    uri : uri,
    method : 'GET'
  })

  log.info(reply)

  await sns.publish({
    TopicArn: snsTopic, 
    Message: "Burn them all"
  }).promise()

  log.info("published SNS message", { snsTopic })

  await kinesis.putRecord({
    StreamName: streamName, 
    PartitionKey: "partition-key", 
    Data: JSON.stringify({ 
      message: 'You are no son of mine' 
    })
  }).promise()

  log.info("published Kinesis event", { streamName })

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'A Lannister always pays his debts',
      reply: reply
    })
  }
})