import * as amqp from 'amqplib'
import httpStatus from 'http-status'
import { ApiError } from '../errors'
import { productService } from '../product'

const queue = 'order'

export default async function subscriber(){
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    await channel.assertQueue(queue)

    channel.consume(queue, async(message: any) => {
        const content = JSON.parse(message.content.toString())

        console.log(`Message recibido de la cola: ${queue}`)
        console.log(content)

        const cart = content.carts
        for (let item of cart){
        let productStock = await productService.getProductById((item.productId));
        if (productStock != null && productStock >= item.quantity){
            productStock.stock -= item.quantity
            const product = await productService.updateProductById((item.productId), productStock);
            if (!product){
                throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
            }
            console.log(product);
        }

    }
        channel.ack(message)

    })
}

subscriber().catch((error)=>{
    console.log(error)
    process.exit(1)
})
