import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as productService from './product.service';
import * as amqp from 'amqplib'
//import Pulsar from 'pulsar-client'
import { sendMessage } from './product.producer';
//import { crearProductProducer }from './product.producer';

var channel: amqp.Channel, connection;
//var queuecreate = 'create-product'
var queueupdate = 'update-product'
var queuedelete = 'delete-product'

async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("create-product");
  await channel.assertQueue("update-product");
  await channel.assertQueue("delete-product");
}
connect();

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req.user._id;
  const product = await productService.createProduct(req.body);

  await sendMessage(product);

  // (async () => {
  //   // Create a client
  //   const client = new Pulsar.Client({
  //     serviceUrl: 'pulsar://localhost:6650',
  //   });
  
  //   // Create a producer
  //   const producer = await client.createProducer({
  //     topic: 'my-topic',
  //   });
  
  //   // Send messages
  //   for (let i = 0; i < 10; i += 1) {
  //     const msg = `my-message-${i}`;
  //     producer.send({
  //       data: Buffer.from(msg),
  //     });
  //     console.log(`Sent message: ${msg}`);
  //   }
  //   await producer.flush();
  
  //   await producer.close();
  //   await client.close();
  // })();

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
    // axios({
    //   method:'PATCH',
    //   url: (`http://localhost:3001/v1/products/${req.params['productId']}`),
    //   headers: {authorization:req.headers.authorization},
    //   data: {
    //     name: product?.name,
    //     description:product?.description,
    //     price: product?.price,
    //     stock: product?.stock
    //   },
    // }).then(res => {
    //   if (res.status === 200) {
    //     console.log('Producto Modificado')           
    //   }
    // })
    // .catch(e => {
    //   console.log(e+'Error en la modificacion de producto')
    // })
    const sent = await channel.sendToQueue(
      "update-product",
      Buffer.from(
          JSON.stringify({
            product
          })
      )
  );
    sent
        ? console.log(`Sent message to "${queueupdate}" queue`, req.body)
        : console.log(`Fails sending message to "${queueupdate}" queue`, req.body)
    res.send(product);
  }
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    await productService.deleteProductById(new mongoose.Types.ObjectId(req.params['productId']));
    const productId = req.params['productId']
    // axios({
    //   method:'DELETE',
    //   url: (`http://localhost:3001/v1/products/${req.params['productId']}`),
    //   headers: {authorization:req.headers.authorization},
    //   data: {
    //   },
    // }).then(res => {
    //   if (res.status === 200) {
    //     console.log('Producto Eliminado')           
    //   }
    // })
    // .catch(e => {
    //   console.log(e+'Error en la eliminacion de producto')
    // })
    const sent = await channel.sendToQueue(
      "delete-product",
      Buffer.from(
          JSON.stringify({
            productId
          })
      )
  );
    sent
        ? console.log(`Sent message to "${queuedelete}" queue`, productId)
        : console.log(`Fails sending message to "${queuedelete}" queue`, productId)
    res.status(httpStatus.NO_CONTENT).send();
  }
});
