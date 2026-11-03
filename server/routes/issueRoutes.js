
import express from "express";

import {
    createIssue,
    getIssues,
    getIssueById,
    updateIssue,
    deleteIssue
} from "../controllers/issueController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all issue APIs
router.use(authMiddleware);

router.post("/", createIssue);

router.get("/", getIssues);

router.get("/:id", getIssueById);

router.put("/:id", updateIssue);

router.delete("/:id", deleteIssue);

export default router;
