import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "User name is required"]
  },
  title: {
    type: String,
    trim: true,
    required: [true, "Title name is required"]
  },
  avatar: {
    type: String,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("User", UserSchema);