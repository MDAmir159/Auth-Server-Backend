import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  password: string;
  isActivated: boolean;
  activationToken?: string;
}

const userSchema: Schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  mobileNumber: { type: String },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationToken: { type: String }
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;