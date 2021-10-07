import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/import-products-file';
import importFileParser from '@functions/import-file-parser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  useDotenv: true,
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: '${env:REGION}' as AWS['provider']['region'],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      REGION: '${env:REGION}',
      S3_BUCKET_NAME: '${env:S3_BUCKET_NAME}',
      S3_UPLOADED_FOLDER: '${S3_UPLOADED_FOLDER}',
      S3_PARSED_FOLDER: '${S3_PARSED_FOLDER}',
      SQS_CATALOG_ITEMS_QUEUE: {
        Ref: 'catalogItemsQueue'
      }
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: [
          'arn:aws:s3:::${env:S3_BUCKET_NAME}/*'
        ]
      },
      {
        Effect: 'Allow',
        Action: [
          's3:GetObject',
          's3:PutObject',
          's3:DeleteObject'
        ],
        Resource: [
          'arn:aws:s3:::${env:S3_BUCKET_NAME}/${S3_UPLOADED_FOLDER}/*',
          'arn:aws:s3:::${env:S3_BUCKET_NAME}/${S3_PARSED_FOLDER}/*'
        ]
      },
      {
        Effect: 'Allow',
        Action: [
          'SQS:SendMessage'
        ],
        Resource: [
          {
            'Fn::GetAtt': ['catalogItemsQueue', 'Arn'],
          },
        ],
      }
    ]
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalog-items-queue',
          ReceiveMessageWaitTimeSeconds: 20,
        },
      },
    },
    Outputs: {
      SqsQueueArn: {
        Value: {
          'Fn::GetAtt': ['catalogItemsQueue', 'Arn'],
        },
        Export: {
          Name: 'catalogItemsQueue',
        },
      },
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
