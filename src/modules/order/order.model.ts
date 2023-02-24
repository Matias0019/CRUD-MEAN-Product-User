import mongoose from 'mongoose';
import Schema from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IOrderDoc, IOrderModel } from './order.interfaces';

const orderSchema = new mongoose.Schema<IOrderDoc, IOrderModel>(
  {
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    product: [{
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    }],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

const Order = mongoose.model<IOrderDoc, IOrderModel>('Order', orderSchema);

export default Order;
