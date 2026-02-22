const Faq = require("../models/FaqModel");

exports.createFaq = async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        error: "Question and answer are required",
      });
    }

    const newFaq = await Faq.create({
      question: typeof question === "string" ? JSON.parse(question) : question,
      answer: typeof answer === "string" ? JSON.parse(answer) : answer,
      category: category
        ? typeof category === "string"
          ? JSON.parse(category)
          : category
        : "general",
    });

    res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      data: newFaq,
    });
  } catch (err) {
    console.error("Create FAQ error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.getAllFaqs = async (req, res) => {
  try {
    const category = req.query.category || null;

    let faqs;
    if (category) {
      // Parse category if it's a JSON string
      const categoryFilter =
        typeof category === "string" && category.startsWith("{")
          ? JSON.parse(category)
          : category;
      faqs = await Faq.getByCategory(categoryFilter);
    } else {
      faqs = await Faq.getAll();
    }

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs,
    });
  } catch (err) {
    console.error("Get all FAQs error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.getFaqById = async (req, res) => {
  try {
    const faq = await Faq.getById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        error: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (err) {
    console.error("Get FAQ by ID error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    // Prepare update data with proper JSON handling
    const updateData = {};

    if (question) {
      updateData.question =
        typeof question === "string" ? JSON.parse(question) : question;
    }

    if (answer) {
      updateData.answer =
        typeof answer === "string" ? JSON.parse(answer) : answer;
    }

    if (category) {
      updateData.category =
        typeof category === "string" ? JSON.parse(category) : category;
    }

    const updated = await Faq.updateById(req.params.id, updateData);

    res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Update FAQ error:", err);
    if (err.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: err.message,
      });
    }

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    await Faq.deleteById(req.params.id);

    res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (err) {
    console.error("Delete FAQ error:", err);
    if (err.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: err.message,
      });
    }

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
