import { Document, Model, model, Schema } from 'mongoose'
import { IBook } from './book.model'

export interface ILibrary extends Document {
  name: string
  books: IBook[]
}

export let LibrarySchema: Schema = new Schema({
  name: String,
  books: [{
      type: Schema.Types.ObjectId,
      ref: 'book'
  }]
})

export const Library: Model<ILibrary> = model<ILibrary>(
  'Library',
  LibrarySchema,
)
