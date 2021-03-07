import mongoose from 'mongoose';

const BacklogSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Backlog name is required"]
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Backlog", BacklogSchema);