const awsLambdaFastify = require('aws-lambda-fastify');
const server = require('./server').server;
const proxy = awsLambdaFastify(server);
exports.handler = proxy;