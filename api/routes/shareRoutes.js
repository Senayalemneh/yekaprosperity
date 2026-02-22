const express = require("express");
const controller = require("../controllers/shareController");
const router = express.Router();

router.post("/file", controller.shareFile);
router.delete("/file", controller.revokeFileShare);
router.get("/file/:file_id", controller.listFileShares);

router.post("/folder", controller.shareFolder);
router.delete("/folder", controller.revokeFolderShare);
router.get("/folder/:folder_id", controller.listFolderShares);

module.exports = router;
