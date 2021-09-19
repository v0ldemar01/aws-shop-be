import { handlerPath } from '@libs/handlerResolver';
import schema from 'src/common/models/book/schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.createProduct`,
  events: [
    {
      http: {
        path: 'products',
        method: 'post',
        cors: true,
        request: {
          schemas: {
            'application/json': schema
          }
        },
        response: {
          statusCodes: {
            201: {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          }
        }        
      }
    }
  ]
};