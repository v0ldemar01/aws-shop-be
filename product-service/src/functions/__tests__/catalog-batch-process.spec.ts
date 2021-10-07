import { catalogBatchProcess } from '@functions/catalog-batch-process/handler';
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { Client } from 'pg';

beforeEach(() => {
  jest.spyOn(Client.prototype, 'connect').mockResolvedValue(Promise.resolve());
});

beforeEach(() => {
  jest
    .spyOn(Client.prototype, 'query')
    .mockResolvedValue({ rows: [{ id: 'id' }] });
});

test('catalogBatchProcess should sent message by mocked SNSPublish', async () => {
  AWSMock.setSDKInstance(AWS);
  AWSMock.mock('SNS', 'publish', {
    Message: 'Mocked message',
    Subject: 'Mocked subject',
    Arn: 'Mocked arn',
  });
  await catalogBatchProcess(
    {
      Records: [
        {
          body: JSON.stringify({
            title: 'title',
            price: 100,
            shortDescription: 'New description for test',
            count: 0,
          }),
        },
      ],
    },
    null,
    () => {},
  );
});
