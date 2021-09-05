import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductsList`,
  events: [
    {
      http: {
        path: 'products',
        method: 'get',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              page: true,
              perPage: true
            }
          }
        },
        response: {
          statusCodes: {
            200: {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          }
        },
        
      }
    }
  ]
};