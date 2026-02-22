const db = require("../config/db");

// Helper function to safely parse JSON
const safeJsonParse = (str) => {
  if (!str) return str;

  try {
    // If it's already an object, return as is
    if (typeof str === "object") return str;

    const parsed = JSON.parse(str);
    return parsed;
  } catch (error) {
    // If parsing fails, return the original string
    return str;
  }
};

const FaqModel = {
  create: async (data) => {
    const { question, answer, category = "general" } = data;

    if (!question || !answer) {
      throw new Error("Question and answer are required");
    }

    // For MySQL 5.7, we'll store JSON as string and handle parsing in application layer
    const questionStr =
      typeof question === "object" ? JSON.stringify(question) : question;
    const answerStr =
      typeof answer === "object" ? JSON.stringify(answer) : answer;
    const categoryStr =
      typeof category === "object" ? JSON.stringify(category) : category;

    const sql = `
      INSERT INTO faqs (question, answer, category)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.query(sql, [questionStr, answerStr, categoryStr]);

    return {
      id: result.insertId,
      question:
        typeof question === "object" ? question : safeJsonParse(question),
      answer: typeof answer === "object" ? answer : safeJsonParse(answer),
      category:
        typeof category === "object" ? category : safeJsonParse(category),
    };
  },

  getAll: async (category = null) => {
    let sql = "SELECT * FROM faqs";
    const params = [];

    if (category) {
      // Handle both string and object categories
      const categoryFilter =
        typeof category === "object" ? JSON.stringify(category) : category;
      sql += " WHERE category = ?";
      params.push(categoryFilter);
    }

    sql += " ORDER BY id DESC";

    const [rows] = await db.query(sql, params);

    // Parse JSON strings back to objects
    return rows.map((row) => ({
      ...row,
      question: safeJsonParse(row.question),
      answer: safeJsonParse(row.answer),
      category: safeJsonParse(row.category),
    }));
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM faqs WHERE id = ?", [id]);

    if (rows.length) {
      const row = rows[0];
      return {
        ...row,
        question: safeJsonParse(row.question),
        answer: safeJsonParse(row.answer),
        category: safeJsonParse(row.category),
      };
    }
    return null;
  },

  updateById: async (id, data) => {
    const { question, answer, category } = data;

    // Prepare values for update
    const questionStr = question
      ? typeof question === "object"
        ? JSON.stringify(question)
        : question
      : null;
    const answerStr = answer
      ? typeof answer === "object"
        ? JSON.stringify(answer)
        : answer
      : null;
    const categoryStr = category
      ? typeof category === "object"
        ? JSON.stringify(category)
        : category
      : null;

    const sql = `
      UPDATE faqs
      SET 
        question = COALESCE(?, question),
        answer = COALESCE(?, answer),
        category = COALESCE(?, category)
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [
      questionStr,
      answerStr,
      categoryStr,
      id,
    ]);

    if (result.affectedRows === 0) {
      throw new Error("FAQ not found or no changes made");
    }

    return await FaqModel.getById(id);
  },

  deleteById: async (id) => {
    const [result] = await db.query("DELETE FROM faqs WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      throw new Error("FAQ not found");
    }
    return result;
  },

  // Additional method to get by category with JSON handling
  getByCategory: async (category) => {
    const categoryStr =
      typeof category === "object" ? JSON.stringify(category) : category;
    const [rows] = await db.query(
      "SELECT * FROM faqs WHERE category = ? ORDER BY id DESC",
      [categoryStr]
    );

    return rows.map((row) => ({
      ...row,
      question: safeJsonParse(row.question),
      answer: safeJsonParse(row.answer),
      category: safeJsonParse(row.category),
    }));
  },
};

module.exports = FaqModel;
