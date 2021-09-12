import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/get-books-list';
import getProductById from '@functions/get-book-by-id';

const serverlessConfiguration: AWS = {
  service: 'product-service',
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
      PG_HOST: '${env:TYPEORM_HOST}',
      PG_PORT: '${env:TYPEORM_PORT}',
      PG_USER: '${env:TYPEORM_USERNAME}',
      PG_PASSWORD: '${env:TYPEORM_PASSWORD}',
      PG_DATABASE: '${env:TYPEORM_DATABASE}'
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { getProductsList, getProductById },
};

module.exports = serverlessConfiguration;
