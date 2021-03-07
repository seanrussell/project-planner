import mongoose from 'mongoose';

const BoardLane = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Board lane name is required"]
  },
  title: {
    type: String,
    trim: true,
    required: [true, "Board lane title is required"]
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Board'
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Story'
  },
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  },
  sort: {
    type: Number,
    required: true,
    default: 1
  }
});

export default mongoose.model("BoardLane", BoardLane);