import mongoose from 'mongoose';

const SprintSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Sprint name is required"]
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project'
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board'
  },
  startdate: {
    type: Date,
    default: Date.now
  },
  enddate: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Sprint", SprintSchema);