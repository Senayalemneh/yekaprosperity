const express = require("express");
const controller = require("../controllers/folderController");
const router = express.Router();

// optional: add auth middleware: auth.required
router.post("/", controller.createFolder);
router.get("/", controller.getAllFolders);
router.get("/:id", controller.getFolder);

router.put("/:id", controller.updateFolder);
router.delete("/:id", controller.deleteFolder);

module.exports = router;
