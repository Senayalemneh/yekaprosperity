const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const { upload } = require("../config/upload");

// Create/upload file (multipart/form-data)
router.post("/upload", upload.single("file"), fileController.uploadFile);

// Get file meta
router.get("/:id", fileController.getFile);

// Download
router.get("/:id/download", fileController.downloadFile);

// Update metadata (move folder, rename, add metadata)

router.put("/:id", fileController.updateFile);

// Delete
router.delete("/:id", fileController.deleteFile);

module.exports = router;
