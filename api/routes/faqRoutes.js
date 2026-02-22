const express = require("express");
const faqController = require("../controllers/faqController");

const router = express.Router();

router.post("/", faqController.createFaq);
router.get("/", faqController.getAllFaqs);
router.get("/:id", faqController.getFaqById);
router.put("/:id", faqController.updateFaq);
router.delete("/:id", faqController.deleteFaq);

module.exports = router;
