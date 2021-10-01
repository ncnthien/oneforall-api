import { Document, model, Schema } from 'mongoose'

export interface BrandDocument extends Document {
  name: string
  value: string
  summary: string
  logo: string
  banner: string
}

const brandSchema = new Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  summary: { type: String, required: true },
  logo: { type: String, required: true },
  banner: { type: String, required: true },
})

export default model<BrandDocument>('Brand', brandSchema)
