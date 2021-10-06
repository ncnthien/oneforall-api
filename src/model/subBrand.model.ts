import { Document, model, PopulatedDoc, Schema } from 'mongoose'
import BrandModel, { BrandDocument } from './brand.model'

export interface SubBrandDocument extends Document {
  brand: PopulatedDoc<BrandDocument & Document>
  name: string
  value: string
}

const subBrandSchema = new Schema({
  brand: { type: Schema.Types.ObjectId, required: true, ref: BrandModel },
  name: { type: String, required: true },
  value: { type: String, required: true },
})

export default model<SubBrandDocument>('SubBrand', subBrandSchema)
