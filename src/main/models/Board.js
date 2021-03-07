import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Board name is required"]
  },
  sprint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sprint'
  },
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Board", BoardSchema);