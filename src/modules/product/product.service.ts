import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Product from './product.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IProduct, IProductDoc } from './product.interfaces';

/**
 * Create a product
 * @param {IProduct} product
 * @returns {Promise<IProductDoc>}
 */
export const createProduct = async (product: IProduct): Promise<IProductDoc> => {
  return Product.create(product);
};

/**
 * Query for product
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryProducts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const products = await Product.paginate(filter, options);
  return products;
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IProductDoc | null>}
 */
export const getProductById = async (id: mongoose.Types.ObjectId): Promise<IProductDoc | null> => Product.findById(id);

/**
 * Update product by id
 * @param {mongoose.Types.ObjectId} productId
 * @param {IProduct} productBody
 * @returns {Promise<IProductDoc | null>}
 */
export const updateProductById = async (
  productId: mongoose.Types.ObjectId,
  productBody: IProduct
): Promise<IProductDoc | null> => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  Object.assign(product, productBody);
  await product.save();
  return product;
};

/**
 * Delete product by id
 * @param {mongoose.Types.ObjectId} productId
 * @returns {Promise<IProductDoc | null>}
 */
export const deleteProductById = async (productId: mongoose.Types.ObjectId): Promise<IProductDoc | null> => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await product.remove();
  return product;
};
