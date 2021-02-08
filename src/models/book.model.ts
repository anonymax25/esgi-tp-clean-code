import { Document, Model, model, Schema } from 'mongoose'
import { IUser } from './user.model'

export interface IBook extends Document {
  title: string
  author: string
  borowedBy: IUser
}

export let BookSchema: Schema = new Schema({
  title: String,
  author: String,
  borowedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
  }
})

export const Book: Model<IBook> = model<IBook>(
  'Book',
  BookSchema,
)
