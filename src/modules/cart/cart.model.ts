import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { ICartDoc, ICartModel } from './cart.interfaces';

const cartSchema = new mongoose.Schema<ICartDoc, ICartModel>(
  {
    productId: {
      type: String,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
cartSchema.plugin(toJSON);
cartSchema.plugin(paginate);

const Cart = mongoose.model<ICartDoc, ICartModel>('Cart', cartSchema);

export default Cart;
