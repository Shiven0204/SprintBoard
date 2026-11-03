
import Project from "../models/Project.js";
import Issue from "../models/Issue.js";

export const getDashboardStats = async (req, res) => {
    try {
        const projectIds = await Project.find({ createdBy: req.user.id }).distinct("_id");
        const filter = { projectId: { $in: projectIds } };

        const [projectSummary, issueSummary] = await Promise.all([
            Project.countDocuments({ createdBy: req.user.id }),
            Issue.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: null,
                        totalIssues: { $sum: 1 },
                        openIssues: {
                            $sum: { $cond: [{ $eq: ["$status", "To Do"] }, 1, 0] }
                        },
                        inProgressIssues: {
                            $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] }
                        },
                        completedIssues: {
                            $sum: { $cond: [{ $eq: ["$status", "Done"] }, 1, 0] }
                        },
                        highPriorityIssues: {
                            $sum: { $cond: [{ $eq: ["$priority", "High"] }, 1, 0] }
                        }
                    }
                }
            ])
        ]);

        const summary = issueSummary[0] || {};

        res.status(200).json({
            totalProjects: projectSummary,
            totalIssues: summary.totalIssues || 0,
            openIssues: summary.openIssues || 0,
            inProgressIssues: summary.inProgressIssues || 0,
            completedIssues: summary.completedIssues || 0,
            highPriorityIssues: summary.highPriorityIssues || 0
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
