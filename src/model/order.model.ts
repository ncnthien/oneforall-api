import { Document, model, PopulatedDoc, Schema } from 'mongoose'
import ProductModel, { ProductDocument } from './product.model'
import UserModel, { UserDocument } from './user.model'

interface Product {
  ref: PopulatedDoc<ProductDocument & Document>
  quantity: number
  cost: number
}

export interface SubBrandDocument extends Document {
  code: string
  date?: Date
  products: Product[]
  status: 'pending' | 'claimed' | 'delivering' | 'delivered'
  user: PopulatedDoc<UserDocument & Document>
}

const productSchema = new Schema({
  ref: { type: Schema.Types.ObjectId, ref: ProductModel },
  quantity: { type: Number, required: true },
  cost: { type: Number, required: true },
})

const orderSchema = new Schema({
  code: { type: String, required: true },
  date: { type: Date, default: Date.now },
  products: { type: [productSchema], required: true },
  status: {
    type: String,
    enum: ['pending', 'claimed', 'delivering', 'delivered'],
    required: true,
  },
  user: { type: Schema.Types.ObjectId, required: true, ref: UserModel },
})

export default model<SubBrandDocument>('Order', orderSchema)
