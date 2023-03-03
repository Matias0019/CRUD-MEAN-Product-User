import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { ICart } from './cart.interfaces';

const createCartBody: Record<keyof ICart, any> = {
  productId: Joi.string().required(),
  quantity: Joi.number().required(),
};

export const createCart = {
  body: Joi.object().keys(createCartBody),
};

export const getCarts = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId),
  }),
};

export const updateCart = {
  params: Joi.object().keys({
    cartId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      productId: Joi.string().required(),
      quantity: Joi.number().required(),
    })
    .min(1),
};

export const deleteCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId),
  }),
};
