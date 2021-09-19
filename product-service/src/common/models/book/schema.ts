export default {
  type: 'object',
  properties: {
    title: {
      type: 'string'
    },
    pageCount: {
      type: 'number'
    },
    publishedDate: {
      type: 'string'
    },
    thumbnailUrl: {
      type: 'string'
    },
    shortDescription: {
      type: 'string'
    },
    longDescription: {
      type: 'string'
    },
    status: {
      type: 'string'
    },
    authors: {
      type: 'array',
      items: {
        type: 'string'
      },
      minItems: 1
    },
    categories: {
      type: 'array',
      items: {
        type: 'string'
      },
      minItems: 1
    },
    price: {
      type: 'number'
    },
    count: {
      type: 'number'
    },
  },
  required: ['title', 'pageCount', 'publishedDate', 'thumbnailUrl', 'shortDescription', 
    'longDescription', 'status', 'authors', 'categories', 'price', 'count']
} as const;