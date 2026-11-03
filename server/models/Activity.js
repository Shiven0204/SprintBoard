import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
{
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
},
issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue",
    required: true,
},
action: {
    type: String,
    required: true,
},
},
{ timestamps: true },
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
