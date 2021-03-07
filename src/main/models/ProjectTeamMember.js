import mongoose from 'mongoose';

const ProjectTeamMemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
    }
});

export default mongoose.model("ProjectTeamMember", ProjectTeamMemberSchema);