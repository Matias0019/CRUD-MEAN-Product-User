import { Document, Model } from "mongoose";
import { QueryResult } from "../paginate/paginate";

export interface ICart {
    productId: string;
    quantity: number;
}

export interface ICartDoc extends ICart, Document {
  }

export interface ICartModel extends Model<ICartDoc>{
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
  }
