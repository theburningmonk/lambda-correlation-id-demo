const AWS            = require('aws-sdk');
const SNS            = new AWS.SNS();
const log            = require('./log');
const requestContext = require('./requestContext');

function getMessageAttributes() {
  let attributes = {};
  let ctx = requestContext.get();
  for (let key in ctx) {
    attributes[key] = {
      DataType: 'String',
      StringValue: ctx[key]
    };
  }

  return attributes;
}

let publish = async (topicArn, msg) => {
  let req = {
    Message: msg,
    MessageAttributes: getMessageAttributes(),
    TopicArn: topicArn
  };
  
  await SNS.publish(req).promise();
};

module.exports = {
  publish
};