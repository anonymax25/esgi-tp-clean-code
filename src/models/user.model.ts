import { Document, Model, model, Schema } from 'mongoose'
import { UserRoles } from './enums/userRoles.enum'

export interface IUser extends Document {
  login: string,
  role: UserRoles,
}

export let UserSchema: Schema = new Schema({
  login: String,
  role: String,
})

export const User: Model<IUser> = model<IUser>(
  'User',
  UserSchema,
)
