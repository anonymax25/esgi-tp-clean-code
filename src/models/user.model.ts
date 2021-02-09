import { Document, Model, model, Schema } from 'mongoose'
import { IBook } from './book.model'
import { UserRoles } from './enums/userRoles.enum'

export interface IUser extends Document {
  login: string,
  role: UserRoles,
  books: IBook[]
}

export let UserSchema: Schema = new Schema({
  login: String,
  role: String,
  books: [{
    type: Schema.Types.ObjectId,
    ref: 'book'
  }]
})

export const User: Model<IUser> = model<IUser>(
  'User',
  UserSchema,
)
