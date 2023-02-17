import { Document, Model } from "mongoose";
import { QueryResult } from "../paginate/paginate";

export interface IProduct {
    name: string;
    description: string;
    price: number;
    stock: number;
}

export interface IProductDoc extends IProduct, Document {
  }

export interface IProductModel extends Model<IProductDoc>{
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
  }
