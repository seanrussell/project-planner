import mongoose from 'mongoose';

const Story = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Story name is required"]
  },
  description: {
    type: String,
    trim: true
  },
  effort: {
    type: Number
  },
  backlog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Backlog'
  },
  sprint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sprint'
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board'
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
  },
  state: {
    type: String,
    trim: true
  },
  uuid: {
    type: String,
    trim: true
  }
});

export default mongoose.model("Story", Story);