import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { ICart, ICartDoc } from './cart.interfaces';
import Cart from './cart.model';

/**
 * Create a cart
 * @param {ICart} cart
 * @returns {Promise<ICartDoc>}
 */
export const createCart = async (cart: ICart): Promise<ICartDoc> => {
  return Cart.create(cart);
};

/**
 * Query for cart
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryCarts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const carts = await Cart.paginate(filter, options);
  return carts;
};

/**
 * Get cart by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ICartDoc | null>}
 */
export const getCartById = async (id: mongoose.Types.ObjectId): Promise<ICartDoc | null> => Cart.findById(id);

/**
 * Update cart by id
 * @param {mongoose.Types.ObjectId} cartId
 * @param {IProduct} cartBody
 * @returns {Promise<ICartDoc | null>}
 */
export const updateCartById = async (
  cartId: mongoose.Types.ObjectId,
  cartBody: ICart
): Promise<ICartDoc | null> => {
  const cart = await getCartById(cartId);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  Object.assign(cart, cartBody);
  await cart.save();
  return cart;
};

/**
 * Delete cart by id
 * @param {mongoose.Types.ObjectId} cartId
 * @returns {Promise<IProductDoc | null>}
 */
export const deleteCartById = async (cartId: mongoose.Types.ObjectId): Promise<ICartDoc | null> => {
  const cart = await getCartById(cartId);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  await cart.remove();
  return cart;
};
