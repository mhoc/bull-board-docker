import { Queue } from "bullmq";
import express from "express";
import { Redis } from "ioredis";

import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";

const port = process.env.PORT;
if (!port) {
  throw new Error("PORT must be defined");
}

const queueNamesStr = process.env.QUEUE_NAMES;
if (!queueNamesStr || queueNamesStr.length === 0) {
  throw new Error(
    "QUEUE_NAMES must be defined as a comma-separated list of queue names to load into the bull board"
  );
}
const queueNames = queueNamesStr.split(",");

const redisHost = process.env.REDIS_HOST;
if (!redisHost) {
  throw new Error("REDIS_HOST must be defined");
}
const redisPortStr = process.env.REDIS_PORT;
if (!redisPortStr) {
  throw new Error("REDIS_PORT");
}
const redisPort = parseInt(redisPortStr, 10);

console.log("Connecting to redis");
const redis = new Redis({ host: redisHost, port: redisPort });

console.log(`Loading bull-board for queues: ${queueNames}`);
const queues = queueNames.map((name) => {
  return new Queue(name, { connection: redis });
});

console.log("Creating server adapter on /");
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/");

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: queues.map((q) => new BullAdapter(q)),
  serverAdapter: serverAdapter,
});

const app = express();
app.use("/", serverAdapter.getRouter());

console.log(`Starting bull-board on port ${port}...`);
app.listen(port, () => {
  console.log(`Open http://localhost:${port}/`);
});
