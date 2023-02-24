import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as productService from './product.service';
import axios from 'axios';

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req.user._id;
  const product = await productService.createProduct(req.body);
  axios({
    method:'POST',
    url: 'http://localhost:3001/v1/products',
    headers: {authorization:req.headers.authorization},
    data: {
      _id: product._id,
      name: product.name,
      description:product.description,
      price: product.price,
      stock: product.stock
    },
  }).then(res => {
    if (res.status === 200) {
      console.log('Producto Replicado')           
    }
  })
  .catch(e => {
    console.log(e+'Error en replicacion de producto')
  })
  res.status(httpStatus.CREATED).send(product);
});

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const filter = {user:req.user._id};
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await productService.queryProducts(filter, options);
  res.send(result);
});

export const getProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    const product = await productService.getProductById(new mongoose.Types.ObjectId(req.params['productId']));
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    res.send(product);
  }
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    const product = await productService.updateProductById(new mongoose.Types.ObjectId(req.params['productId']), req.body);
    axios({
      method:'PATCH',
      url: (`http://localhost:3001/v1/products/${req.params['productId']}`),
      headers: {authorization:req.headers.authorization},
      data: {
        name: product?.name,
        description:product?.description,
        price: product?.price,
        stock: product?.stock
      },
    }).then(res => {
      if (res.status === 200) {
        console.log('Producto Modificado')           
      }
    })
    .catch(e => {
      console.log(e+'Error en la modificacion de producto')
    })
    res.send(product);
  }
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    await productService.deleteProductById(new mongoose.Types.ObjectId(req.params['productId']));
    axios({
      method:'DELETE',
      url: (`http://localhost:3001/v1/products/${req.params['productId']}`),
      headers: {authorization:req.headers.authorization},
      data: {
      },
    }).then(res => {
      if (res.status === 200) {
        console.log('Producto Eliminado')           
      }
    })
    .catch(e => {
      console.log(e+'Error en la eliminacion de producto')
    })
    res.status(httpStatus.NO_CONTENT).send();
  }
});
