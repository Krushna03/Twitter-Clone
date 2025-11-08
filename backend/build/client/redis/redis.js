"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redisUrl = "rediss://default:AYg8AAIncDJkYWM3N2Q3NjE3NTI0MWJiOGRhZTU0Mzk2YzQ5ZWQxY3AyMzQ4NzY@factual-woodcock-34876.upstash.io:6379";
exports.redisClient = new ioredis_1.default(redisUrl, {
    tls: {
        rejectUnauthorized: false
    },
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
});
// Add error handler
exports.redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err.message);
});
exports.redisClient.on('connect', () => {
    console.log('✅ Redis Client Connected');
});
exports.redisClient.on('ready', () => {
    console.log('✅ Redis Client Ready');
});
// Test connection
exports.redisClient.ping()
    .then((result) => {
    console.log('✅ Redis Ping Success:', result);
})
    .catch((err) => {
    console.error('❌ Redis Ping Failed:', err.message);
});
