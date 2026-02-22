const express = require("express");
const controller = require("../controllers/orgController");

const router = express.Router();

router.post("/", controller.createNode);
router.get("/", controller.getAllNodes);
router.get("/:id", controller.getNodeById);
router.put("/:id", controller.updateNode);
router.delete("/:id", controller.deleteNode);

module.exports = router;
