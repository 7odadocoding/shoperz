const { isValidObjectId } = require('mongoose');
const Product = require('../models/Product');
const { filterQuery, parseFilters } = require('../utils/filtering');
const Responser = require('../utils/responser');
const { ValidationError } = require('../middlewares/errorhandler');

const getProducts = async (req, res, next) => {
  try {
    const {
      q,
      parts,
      limit = 10,
      sort,
      page,
      pmin,
      pmax,
      colors,
      category,
      rating,
      freeDelivery,
      brands,
    } = req.query;
    let query = filterQuery('$and', { q, pmin, pmax, colors, category, rating, freeDelivery, brands });
    const { products, actualProductsLength } = await Product.getProducts(query, limit, page, sort);
    const msg =
      products?.length >= 1 ? 'The data was successfully obtained .' : "There's no data here for now .";
    const responser = new Responser(
      200,
      msg,
      Object.assign(
        { products },
        parts?.includes('filters') && { filters: parseFilters(products) },
        parts?.includes('pagination') && {
          pagination: {
            limit,
            currentPage: page,
            remainingPages: Math.ceil(actualProductsLength / +limit),
            actualProductsLength,
            length: products?.length,
          },
        }
      )
    );

    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};

const getFeatured = async (req, res, next) => {};
const getTopSellers = async (req, res, next) => {};

// @desc get top rated products , can search with products related by specific category
// @route /products/top-rated
// @access Public
// @params { limit: number , page : number ,relatedByCategory: ObjectId }

const getTopRated = async (req, res, next) => {
  try {
    //
    const { limit = 15, page = 1, relatedByCategory } = req.query;
    const skip = +page * +limit;
    const query = Product.find();
    if (!relatedByCategory) {
      query.where('rating').gte(4.0);
      query.limit(limit);
      query.skip(skip);
    } else {
      query.where('rating').gte(4.0);
      query.limit(limit);
      query.skip(skip);
      query.where('category_id', relatedByCategory);
    }
    const topRatedProducts = await query;
    const msg =
      topRatedProducts?.length >= 1
        ? 'The data was successfully obtained .'
        : "There's no data here for now .";
    const responser = new Responser(200, msg, {
      products: topRatedProducts,
      paginition: {
        length: topRatedProducts?.length,
        page,
      },
    });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};

// @desc get big offered products , can search with products related by specific category
// @route /products/mega-offers
// @access Public
// @params { limit: number , page : number ,relatedByCategory: ObjectId }

const getMegaOffers = async (req, res, next) => {
  try {
    const { page = 1, limit = 3, relatedByCategory } = req.query;
    const skip = +page * +limit;

    const query = Product.find();
    if (!relatedByCategory) {
      query.where('discount').gte(10);
      query.where('rating').gte(3.0);
      query.skip(skip);
      query.limit(limit);
    } else {
      query.where('discount').gte(10);
      query.where('rating').gte(3.0);
      query.skip(skip);
      query.limit(limit);
      query.where('category_id', relatedByCategory);
    }
    const megaOfferProducts = await query;
    const msg =
      megaOfferProducts?.length >= 1
        ? 'The data was successfully obtained .'
        : "There's no data here for now .";
    const responser = new Responser(200, msg, {
      products: megaOfferProducts,
      paginition: {
        length: megaOfferProducts?.length,
        page,
      },
    });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};

// @desc search inside the products and return list of matched product
// @route /products/search
// @access Public
// query { q : string }

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw new ValidationError('Not a valid product id ' + id);
    const product = await Product.findById(id).populate({ path: 'category_id', select: 'name' });
    if (product) {
      let responser = new Responser(200, 'Product details was fetched successfully .', { product });
      return responser.respond(res);
    }
    let responser = new Responser(404, 'Product details is not exist .', { product: [] });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};
// dashboard

const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    let newProduct = await product.save();
    let responser = new Responser(201, 'created successfully', { newProduct });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};

const createProducts = async (req, res, next) => {
  try {
    const products = await Product.create(req.body.products);
    let responser = new Responser(201, 'created successfully', { products });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await product.save();
    let responser = new Responser(201, 'updated successfully', { product: product._id });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    let responser = new Responser(200, 'deleted successfully', { product: product._id });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  createProducts,
  updateProduct,
  deleteProduct,
  getFeatured,
  getTopRated,
  getMegaOffers,
  getTopSellers,
};
