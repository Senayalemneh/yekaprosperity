const News = require("../models/NewsModel");

exports.createNews = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title || !req.body.title.en) {
      return res.status(400).json({
        success: false,
        error: "Title is required with at least English translation",
      });
    }

    if (!req.body.coverImage) {
      return res.status(400).json({
        success: false,
        error: "Cover image is required",
      });
    }

    const data = {
      coverImage: req.body.coverImage,
      additionalImages: req.body.additionalImages || [],
      postedBy: req.body.postedBy || "Admin",
      status: req.body.status || "published",
      title: {
        en: req.body.title.en,
        am: req.body.title.am || req.body.title.en,
        or: req.body.title.or || req.body.title.en,
      },
      description: {
        en: req.body.description?.en || "",
        am: req.body.description?.am || req.body.description?.en || "",
        or: req.body.description?.or || req.body.description?.en || "",
      },
      category: {
        en: req.body.category?.en || "General",
        am: req.body.category?.am || req.body.category?.en || "አጠቃላይ",
        or: req.body.category?.or || req.body.category?.en || "Waliigalaa",
      },
      publishedDate: req.body.publishedDate || new Date(),
    };

    const result = await News.create(data);
    res.status(201).json({
      success: true,
      message: "News created successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error creating news:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.getAllNews = async (req, res) => {
  try {
    const status = req.query.status; // Optional status filter
    const news = await News.getAll(status);
    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.getById(req.params.id);
    if (!news) {
      return res.status(404).json({
        success: false,
        error: "News not found",
      });
    }
    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (err) {
    console.error("Error fetching news:", err);
    if (err.message.includes("Invalid")) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.updateNews = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No data provided for update",
      });
    }

    // Validate at least one field is being updated
    const allowedFields = [
      "coverImage",
      "additionalImages",
      "postedBy",
      "status",
      "title",
      "description",
      "category",
      "publishedDate",
    ];
    const hasValidField = Object.keys(req.body).some((field) =>
      allowedFields.includes(field)
    );

    if (!hasValidField) {
      return res.status(400).json({
        success: false,
        error: "No valid fields provided for update",
      });
    }

    const data = {
      coverImage: req.body.coverImage,
      additionalImages: req.body.additionalImages,
      postedBy: req.body.postedBy,
      status: req.body.status,
      title: req.body.title
        ? {
            en: req.body.title.en || "",
            am: req.body.title.am || req.body.title.en || "",
            or: req.body.title.or || req.body.title.en || "",
          }
        : undefined,
      description: req.body.description
        ? {
            en: req.body.description.en || "",
            am: req.body.description.am || req.body.description.en || "",
            or: req.body.description.or || req.body.description.en || "",
          }
        : undefined,
      category: req.body.category
        ? {
            en: req.body.category.en || "",
            am: req.body.category.am || req.body.category.en || "",
            or: req.body.category.or || req.body.category.en || "",
          }
        : undefined,
      publishedDate: req.body.publishedDate,
    };

    const result = await News.updateById(req.params.id, data);
    res.status(200).json({
      success: true,
      message: "News updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error updating news:", err);
    if (err.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: err.message,
      });
    }
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.updateNewsStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !["published", "unpublished"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Valid status is required (published/unpublished)",
      });
    }

    const result = await News.updateStatus(req.params.id, status);
    res.status(200).json({
      success: true,
      message: "News status updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error updating news status:", err);
    if (err.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: err.message,
      });
    }
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const deletedNews = await News.deleteById(req.params.id);
    res.status(200).json({
      success: true,
      message: "News deleted successfully",
      data: deletedNews,
    });
  } catch (err) {
    console.error("Error deleting news:", err);
    if (err.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: err.message,
      });
    }
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!category) {
      return res.status(400).json({
        success: false,
        error: "Category parameter is required",
      });
    }

    const news = await News.getByCategory(category, "published");
    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (err) {
    console.error("Error fetching news by category:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};
