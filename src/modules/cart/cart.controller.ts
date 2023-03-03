import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as cartService from './cart.service';

export const createCart = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req.user._id
  const cart = await cartService.createCart(req.body);
  res.status(httpStatus.CREATED).send(cart);
});

export const getCarts = catchAsync(async (req: Request, res: Response) => {
  const filter = {user:req.user._id};
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await cartService.queryCarts(filter, options);
  res.send(result);
});

export const getCart = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['cartId'] === 'string') {
    const cart = await cartService.getCartById(new mongoose.Types.ObjectId(req.params['cartId']));
    if (!cart) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
    }
    res.send(cart);
  }
});

export const updateCart = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['cartId'] === 'string') {
    const cart = await cartService.updateCartById(new mongoose.Types.ObjectId(req.params['cartId']), req.body);
    res.send(cart);
  }
});

export const deleteCart = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['cartId'] === 'string') {
    await cartService.deleteCartById(new mongoose.Types.ObjectId(req.params['cartId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
