import mongoose from 'mongoose';
import Schema from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IProductDoc, IProductModel } from './product.interfaces';

const productSchema = new mongoose.Schema<IProductDoc, IProductModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

const Product = mongoose.model<IProductDoc, IProductModel>('Product', productSchema);

export default Product;
