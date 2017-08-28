'use strict';

const co             = require('co');
const Promise        = require('bluebird');
const AWS            = require('aws-sdk');
const Kinesis        = Promise.promisifyAll(new AWS.Kinesis());
const log            = require('./log');
const requestContext = require('./requestContext');

let putRecord = co.wrap(function* (streamName, partitionKey, record) {
  // save the request context as part of the payload
  let ctx = requestContext.get();
  record.__context = ctx;

  let data = JSON.stringify(record);

  let req = {
    Data: data,
    PartitionKey: partitionKey,
    StreamName: streamName
  };

  yield Kinesis.putRecordAsync(req);
});

module.exports = {
  putRecord
};