
import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: String,

  status: {
  type: String,
  enum: ["To Do", "In Progress", "Done"],
  default: "To Do"
},

priority: {
  type: String,
  enum: ["Low", "Medium", "High"],
  default: "Medium"
},

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model("Issue", issueSchema);
