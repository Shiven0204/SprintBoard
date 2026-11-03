
import Activity from "../models/Activity.js";
import Issue from "../models/Issue.js";
import Project from "../models/Project.js";

export const getRecentActivities = async (req, res) => {
    try {
        // Find user's projects
        const projectIds = await Project.find({
            createdBy: req.user.id
        }).distinct("_id");

        // Find issues belonging to those projects
        const issueIds = await Issue.find({
            projectId: { $in: projectIds }
        }).distinct("_id");

        // Get recent activities
        const activities = await Activity.find({
            userId: req.user.id,
            issueId: { $in: issueIds }
        })
            .populate("userId", "name")
            .populate("issueId", "title")
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json(activities);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
