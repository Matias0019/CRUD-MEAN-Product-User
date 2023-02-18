import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { IProduct } from './product.interfaces';

const createProductBody: Record<keyof IProduct, any> = {
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  user: Joi.string().custom(objectId),
};

export const createProduct = {
  body: Joi.object().keys(createProductBody),
};

export const getProducts = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

export const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      stock: Joi.number().required(),
    })
    .min(1),
};

export const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};
