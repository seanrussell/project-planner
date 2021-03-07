import mongoose from 'mongoose';

const Task = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Task title is required"]
  },
  description: {
    type: String,
    trim: true
  },
  sortorder: {
    type: Number
  },
  workremaining: {
    type: Number
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  },
  boardlane: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BoardLane'
  },
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  },
  assigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

export default mongoose.model("Task", Task);