const express = require("express");
const router = express.Router();
const issueController = require("../controllers/issues");
const { verifyToken, isAdmin, isOfficer } = require("../middlewares/validate");
const { upload } = require("../middlewares/multer.middleware");
const {
  classifyIssue,
  detectDuplicates,
  calculatePriority,
  analyzeSentiment,
  analyzeImageWithML,
} = require("../middlewares/aiServiceMiddleware");

// Image analysis endpoint
router.post(
  "/analyze-image",
  upload.single("image"),
  analyzeImageWithML
);

// Create issue with AI analysis
router.post(
  "/",
  upload.single("file"),
  classifyIssue,
  detectDuplicates,
  calculatePriority,
  issueController.createIssue
);


router.patch("/:id/status", verifyToken, isOfficer, issueController.updateIssueStatus);

// GET: All issues
router.get("/", issueController.getAllIssues);
router.get("/:id",issueController.getIssueById)
router.delete("/issues/:id",verifyToken,isAdmin,issueController. deleteIssue);
router.patch("/issues/:id",verifyToken,issueController.updateIssue)

module.exports = router;
