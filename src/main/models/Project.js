import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Project name is required"]
  },
  notes: {
    type: String,
    trim: true,
    required: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Project", ProjectSchema);