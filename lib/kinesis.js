const Promise        = require('bluebird');
const AWS            = require('aws-sdk');
const Kinesis        = new AWS.Kinesis();
const log            = require('./log');
const requestContext = require('./requestContext');

let putRecord = async (streamName, partitionKey, record) => {
  // save the request context as part of the payload
  let ctx = requestContext.get();
  record.__context = ctx;

  let data = JSON.stringify(record);

  let req = {
    Data: data,
    PartitionKey: partitionKey,
    StreamName: streamName
  };

  await Kinesis.putRecord(req).promise();
};

module.exports = {
  putRecord
};