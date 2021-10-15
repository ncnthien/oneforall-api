import { Document, model, Schema } from 'mongoose'
import config from '../config'

export interface UserDocument extends Document {
  email: string
  password: string
  username: string
  avatar: string
  phone?: string
  deliveryAddress?: {
    address: string
    ward: string
    district: string
    city: string
  }
  disable: boolean
}

const deliveryAddressSchema = new Schema({
  address: { type: String, required: true },
  ward: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
})

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String },
  username: { type: String, required: true },
  avatar: { type: String, required: true, default: config.defaultAvatar },
  phone: { type: String },
  deliveryAddress: { type: deliveryAddressSchema },
  disable: { type: Boolean, required: true, default: false },
})

export default model<UserDocument>('User', userSchema)
