import { SQS } from 'aws-sdk';

const sqs = new SQS({ region: process.env.REGION });

export const sendMessage = async <T extends object>(message: T) => sqs.sendMessage({
  QueueUrl: process.env.SQS_CATALOG_ITEMS_QUEUE,
  MessageBody: JSON.stringify(message)
}).promise()
