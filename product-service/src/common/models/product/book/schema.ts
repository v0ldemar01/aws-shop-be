export default {
  type: 'object',
  properties: {
    title: {
      type: 'string'
    },
    isbn: {
      type: 'string'
    },
    pageCount: {
      type: 'string'
    },
    publishedDate: {
      type: 'object',
      properties: {
        $date: Date
      }
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
    }
  },
  required: ['title', 'isbn', 'pageCount', 'publishedDate', 'thumbnailUrl', 'shortDescription', 
    'longDescription', 'status', 'authors', 'categories']
} as const;