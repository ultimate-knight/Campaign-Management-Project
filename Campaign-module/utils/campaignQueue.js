// services/campaignQueue.js
const Queue = require('bull');

const redisConfig = { redis: { host: process.env.REDIS_HOST || '127.0.0.1', port: process.env.REDIS_PORT || 6379 } };

const campaignQueue = new Queue('campaignQueue', redisConfig);

module.exports = campaignQueue;
