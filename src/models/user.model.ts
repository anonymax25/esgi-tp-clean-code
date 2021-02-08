import { Document, Model, model, Schema } from 'mongoose'

export interface IUser extends Document {
  login: string,
  role: string,
}

export let UserSchema: Schema = new Schema({
  login: String,
  role: String,
})

export const User: Model<IUser> = model<IUser>(
  'User',
  UserSchema,
)
