const mongoose = require('mongoose');

class ProductClass {}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    colors: {
      type: [String],
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

productSchema.loadClass(ProductClass);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;