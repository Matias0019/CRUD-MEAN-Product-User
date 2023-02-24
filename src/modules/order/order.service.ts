import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IOrder, IOrderDoc } from './order.interfaces';
import Order from './order.model';

/**
 * Create a order
 * @param {IOrder} order
 * @returns {Promise<IOrderDoc>}
 */
export const createOrder = async (order: IOrder): Promise<IOrderDoc> => {
  return Order.create(order);
};

/**
 * Query for order
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryOrders = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const orders = await Order.paginate(filter, options);
  return orders;
};

/**
 * Get order by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IProductDoc | null>}
 */
export const getOrderById = async (id: mongoose.Types.ObjectId): Promise<IOrderDoc | null> => Order.findById(id);

/**
 * Update order by id
 * @param {mongoose.Types.ObjectId} orderId
 * @param {IProduct} orderBody
 * @returns {Promise<IProductDoc | null>}
 */
export const updateOrderById = async (
  orderId: mongoose.Types.ObjectId,
  orderBody: IOrder
): Promise<IOrderDoc | null> => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  Object.assign(order, orderBody);
  await order.save();
  return order;
};

/**
 * Delete product by id
 * @param {mongoose.Types.ObjectId} orderId
 * @returns {Promise<IProductDoc | null>}
 */
export const deleteOrderById = async (orderId: mongoose.Types.ObjectId): Promise<IOrderDoc | null> => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  await order.remove();
  return order;
};
