
import mongoose from "mongoose";

import Issue from "../models/Issue.js";
import Project from "../models/Project.js";
import Activity from "../models/Activity.js";

// CREATE ISSUE
export const createIssue = async (req, res) => {
    try {
        const { title, description, status, priority, projectId } = req.body;

        if (!title || !title.trim() || !projectId) {
            return res.status(400).json({
                message: "Title and project ID are required"
            });
        }

        if (!mongoose.isValidObjectId(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID"
            });
        }

        // Check project ownership
        const project = await Project.findOne({
            _id: projectId,
            createdBy: req.user.id
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const issue = await Issue.create({
            title: title.trim(),
            description,
            status,
            priority,
            projectId,
            createdBy: req.user.id
        });

        // Activity log
        await Activity.create({
            userId: req.user.id,
            issueId: issue._id,
            action: `Created issue: ${issue.title}`
        });

        res.status(201).json({
            message: "Issue created successfully",
            issue
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


// GET ALL ISSUES + FILTER + SEARCH
export const getIssues = async (req, res) => {
    try {
        const { status, priority, project, projectId, search } = req.query;

        // Find user's projects
        const projects = await Project.find({
            createdBy: req.user.id
        }).select("_id");

        const projectIds = projects.map(p => p._id);

        const filter = {
            projectId: { $in: projectIds }
        };

        // Filter by status
        if (status) {
            if (!["To Do", "In Progress", "Done"].includes(status)) {
                return res.status(400).json({
                    message: "Invalid status"
                });
            }
            filter.status = status;
        }

        // Filter by priority
        if (priority) {
            if (!["Low", "Medium", "High"].includes(priority)) {
                return res.status(400).json({
                    message: "Invalid priority"
                });
            }
            filter.priority = priority;
        }

        // Filter by project
        const requestedProject = projectId || project;
        if (requestedProject) {
            if (!mongoose.isValidObjectId(requestedProject)) {
                return res.status(400).json({
                    message: "Invalid project ID"
                });
            }

            filter.projectId = {
                $in: projectIds.filter(
                    id => id.toString() === requestedProject
                )
            };
        }

        // Search by title
        if (search && search.trim()) {
            filter.title = {
                $regex: search.trim(),
                $options: "i"
            };
        }

        const issues = await Issue.find(filter)
            .populate("projectId", "name")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(issues);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET SINGLE ISSUE
export const getIssueById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid issue ID"
            });
        }

        const projects = await Project.find({
            createdBy: req.user.id
        }).distinct("_id");

        const issue = await Issue.findOne({
            _id: req.params.id,
            projectId: { $in: projects }
        })
            .populate("projectId", "name")
            .populate("createdBy", "name");

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        res.status(200).json(issue);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// UPDATE ISSUE
export const updateIssue = async (req, res) => {
    try {
        const { title, description, status, priority } = req.body;

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid issue ID"
            });
        }

        if (title !== undefined && !title.trim()) {
            return res.status(400).json({
                message: "Title cannot be empty"
            });
        }

        const projects = await Project.find({
            createdBy: req.user.id
        }).distinct("_id");

        const issue = await Issue.findOne({
            _id: req.params.id,
            projectId: { $in: projects }
        });

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        const oldStatus = issue.status;

        if (status !== undefined && !["To Do", "In Progress", "Done"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        if (priority !== undefined && !["Low", "Medium", "High"].includes(priority)) {
            return res.status(400).json({ message: "Invalid priority" });
        }

        if (title !== undefined) issue.title = title.trim();
        if (description !== undefined) issue.description = description;
        if (status !== undefined) issue.status = status;
        if (priority !== undefined) issue.priority = priority;

        await issue.save();

        // Activity log
        let action = `Updated issue: ${issue.title}`;

        if (oldStatus !== issue.status) {
            action = `Changed status from ${oldStatus} to ${issue.status}`;
        }

        await Activity.create({
            userId: req.user.id,
            issueId: issue._id,
            action
        });

        res.status(200).json({
            message: "Issue updated successfully",
            issue
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


// DELETE ISSUE
export const deleteIssue = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid issue ID"
            });
        }

        const projects = await Project.find({
            createdBy: req.user.id
        }).distinct("_id");

        const issue = await Issue.findOneAndDelete({
            _id: req.params.id,
            projectId: { $in: projects }
        });

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        // Remove associated activity logs
        await Activity.deleteMany({
            issueId: issue._id
        });

        res.status(200).json({
            message: "Issue deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
