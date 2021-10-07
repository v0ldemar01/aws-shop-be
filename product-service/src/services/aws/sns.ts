import { SNS } from 'aws-sdk';

const sns = new SNS({ region: process.env.REGION });

export const publish = async (isSuccessful: boolean, message: string) => {
  const status = isSuccessful ? 'success' : 'error';
  return sns.publish({
    Subject: status.charAt(0) + status.slice(1) + 'product creation',
    Message: message,
    TopicArn: process.env.SNS_CREATE_PRODUCT_TOPIC,
    MessageAttributes: {
      status: {
        DataType: 'String',
        StringValue: status
      },
    },
  }).promise();
};