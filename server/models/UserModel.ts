import { model, Model, Schema } from 'mongoose';

const UserSchema: Schema<IUser> = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: false, // fallback to username i.e. if not present use username
  },
  username: {
    type: String,
    required: true,
  },
});

const UserModel: Model<IUser> = model('Users', UserSchema);

export default UserModel;
