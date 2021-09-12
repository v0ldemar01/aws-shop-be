import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductById`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{id}',
        request: {
          parameters: {
            paths: {
              id: true
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
        cors: true
      }
    }
  ]
};