import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/get-books-list';
import getProductById from '@functions/get-book-by-id';
import createProduct from '@functions/create-book';

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
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },    
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: '${env:PG_HOST}',
      PG_PORT: '${env:PG_PORT}',
      PG_USER: '${env:PG_USERNAME}',
      PG_PASSWORD: '${env:PG_PASSWORD}',
      PG_DATABASE: '${env:PG_DATABASE}'
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { getProductsList, getProductById, createProduct },
};

module.exports = serverlessConfiguration;
