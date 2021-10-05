import { Document, model, Schema } from 'mongoose'

interface EventDocument extends Document {
  title: string
  banner: string
  url: string
  isActive: boolean
}

const defaultIsActiveValue = false

const eventSchema = new Schema({
  title: { type: String, required: true },
  banner: { type: String, required: true },
  url: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: defaultIsActiveValue },
})

export default model<EventDocument>('Event', eventSchema)
