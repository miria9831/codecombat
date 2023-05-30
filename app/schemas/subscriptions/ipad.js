// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import c from 'schemas/schemas';

export default {
  'ipad:products': c.object({required: ['products']}, {
    products: c.array({},
      c.object({}, {
        price: { type: 'string' },
        id: { type: 'string' }
      }))
  }),
        
  'ipad:language-chosen': c.object({},
    {language: { type: 'string' }}),
    
  'ipad:iap-complete': c.object({},
    {productID: { type: 'string' }}),

  'ipad:memory-warning': c.object({})
};
