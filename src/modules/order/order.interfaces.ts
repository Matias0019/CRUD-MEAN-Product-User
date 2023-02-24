import mongoose, { Document, Model, ObjectId } from "mongoose";
import { QueryResult } from "../paginate/paginate";

export interface IOrder {
    _id: mongoose.Types.ObjectId,
    address: string;
    country: string;
    phone: number;
    total: number;
    product: Array<ObjectId>;
    user: ObjectId;
}

export interface IOrderDoc extends IOrder, Document {
  _id: mongoose.Types.ObjectId,
  }

export interface IOrderModel extends Model<IOrderDoc>{
  _id: mongoose.Types.ObjectId,
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
  }
