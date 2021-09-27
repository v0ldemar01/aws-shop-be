import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true
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
        }
      }
    }
  ]
}