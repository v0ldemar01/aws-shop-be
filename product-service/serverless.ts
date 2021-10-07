import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/get-books-list';
import getProductById from '@functions/get-book-by-id';
import createProduct from '@functions/create-book';
import catalogBatchProcess from '@functions/catalog-batch-process';

const serverlessConfiguration: AWS = {
  service: 'my-product-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  useDotenv: true,
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
      PG_HOST: '${env:PG_HOST}',
      PG_PORT: '${env:PG_PORT}',
      PG_USER: '${env:PG_USERNAME}',
      PG_PASSWORD: '${env:PG_PASSWORD}',
      PG_DATABASE: '${env:PG_DATABASE}',
      SNS_CREATE_PRODUCT_TOPIC: {
        Ref: 'createProductTopic'
      }
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['sqs:ReceiveMessage'],
        Resource: [
          {
            'Fn::GetAtt': ['catalogItemsQueue', 'Arn']
            // 'Fn::ImportValue': catalogItemsQueue
          },
        ],
      },
      {
        Effect: 'Allow',
        Action: ['sns:Publish'],
        Resource: {
          Ref: 'createProductTopic',
        },
      },
    ],
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalog-items-queue'
        },
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'create-product-topic',
        },
      },
      SNSSubscriptionProductImportSuccess: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'voldemarprk2001@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic',
          },
          FilterPolicy: {
            status: ['success'],
          },
        },
      },
      SNSSubscriptionProductImportFail: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'voldemarsec2001@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic',
          },
          FilterPolicy: {
            status: ['failed'],
          },
        },
      },
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductById, createProduct, catalogBatchProcess },
};

module.exports = serverlessConfiguration;
