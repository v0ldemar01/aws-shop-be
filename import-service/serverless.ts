import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/import-products-file';

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
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: [
          'arn:aws:s3:::${env:S3_BUCKET_NAME}'
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
          'arn:aws:s3:::${env:S3_BUCKET_NAME}/parsed/*'
        ]
      },
    ]
  },
  // import the function via paths
  functions: { importProductsFile },
};

module.exports = serverlessConfiguration;
