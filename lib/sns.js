'use strict';

const co             = require('co');
const Promise        = require('bluebird');
const AWS            = require('aws-sdk');
const SNS            = Promise.promisifyAll(new AWS.SNS());
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

let publish = co.wrap(function* (topicArn, msg) {
  let req = {
    Message: msg,
    MessageAttributes: getMessageAttributes(),
    TopicArn: topicArn
  };
  
  yield SNS.publishAsync(req);
});

module.exports = {
  publish
};