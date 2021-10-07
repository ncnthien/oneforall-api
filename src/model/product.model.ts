import { Document, model, PopulatedDoc, Schema } from 'mongoose'
import BrandModel, { BrandDocument } from './brand.model'
import SubBrandModel, { SubBrandDocument } from './subBrand.model'

interface Detail {
  value: string
  text?: string
}

interface ExtraDetail {
  field: string
  value: string
}

export interface ProductDocument extends Document {
  name: string
  type: 'laptop' | 'pc' | 'accessory'
  brand: PopulatedDoc<BrandDocument & Document>
  subBrand: PopulatedDoc<SubBrandDocument & Document>
  price: number
  isSale: boolean
  reducedPrice?: number
  images: string[]
  quantity: number
  cpu?: Detail
  ram?: Detail
  hardDrive?: Detail
  hardDriveNumber?: Detail
  monitorDimension?: Detail
  monitorRatio?: Detail
  monitorBackground?: Detail
  frequency?: Detail
  graphicsCard?: Detail
  graphicsMemory?: Detail
  weight?: Detail
  resolution?: Detail
  accessoryType?: Detail
  extraDetail?: ExtraDetail[]
}

const detailSchema = new Schema({
  value: { type: String, required: true },
  text: { type: String },
})

const extraDetailSchema = new Schema({
  field: { type: String, required: true },
  value: { type: String, required: true },
})

const productSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['laptop', 'pc', 'accessory'], required: true },
  brand: { type: Schema.Types.ObjectId, required: true, ref: BrandModel },
  subBrand: { type: Schema.Types.ObjectId, ref: SubBrandModel },
  price: { type: Number, required: true },
  isSale: { type: Boolean, required: true },
  reducedPrice: { type: Number },
  images: { type: [String], required: true },
  quantity: { type: Number, required: true },
  cpu: { type: detailSchema },
  ram: { type: detailSchema },
  hardDrive: { type: detailSchema },
  hardDriveNumber: { type: detailSchema },
  monitorDimension: { type: detailSchema },
  monitorRatio: { type: detailSchema },
  monitorBackground: { type: detailSchema },
  frequency: { type: detailSchema },
  graphicsCard: { type: detailSchema },
  graphicsMemory: { type: detailSchema },
  weight: { type: detailSchema },
  resolution: { type: detailSchema },
  accessoryType: { type: detailSchema },
  extraDetail: { type: [extraDetailSchema] },
})

export default model<ProductDocument>('Product', productSchema)
