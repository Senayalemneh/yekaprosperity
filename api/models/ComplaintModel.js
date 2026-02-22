const db = require("../config/db");

const safeParse = (data, defaultValue) => {
  if (typeof data === "object") return data;
  if (!data) return defaultValue;
  try {
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
};

const generateTrackingId = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const ComplaintModel = {
  create: async (data) => {
    const {
      full_name,
      age,
      gender,
      submission_type,
      group_members,
      city,
      sub_city,
      woreda,
      house_number,
      phone_number,
      email,
      physical_condition,
      institution_name,
      complaint_content,
      desired_solution,
      evidence_files,
      status = "pending",
    } = data;

    if (!full_name) throw new Error("Full name is required");
    if (!gender || !["male", "female", "other"].includes(gender))
      throw new Error("Valid gender is required");
    if (!submission_type || !["individual", "group"].includes(submission_type))
      throw new Error("Valid submission type is required");
    if (submission_type === "group" && (!group_members || group_members < 1))
      throw new Error("Group members required for group submissions");
    if (!city) throw new Error("City required");
    if (!sub_city) throw new Error("Sub-city required");
    if (!woreda) throw new Error("Woreda required");
    if (!phone_number) throw new Error("Phone number required");
    if (!institution_name) throw new Error("Institution name required");
    if (!complaint_content) throw new Error("Complaint content required");
    if (!desired_solution) throw new Error("Desired solution required");
    if (!["pending", "in_review", "resolved", "rejected"].includes(status))
      throw new Error("Invalid status");

    const tracking_id = generateTrackingId();
    const sql = `
      INSERT INTO complaints (
        tracking_id, full_name, age, gender, submission_type, group_members, city, sub_city,
        woreda, house_number, phone_number, email, physical_condition,
        institution_name, complaint_content, desired_solution, evidence_files, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      tracking_id,
      full_name,
      age,
      gender,
      submission_type,
      submission_type === "group" ? group_members : null,
      city,
      sub_city,
      woreda,
      house_number,
      phone_number,
      email,
      physical_condition,
      institution_name,
      complaint_content,
      desired_solution,
      evidence_files ? JSON.stringify(evidence_files) : null,
      status,
    ]);

    return { id: result.insertId, tracking_id, ...data };
  },

  getAll: async (status, search = "") => {
    let sql = "SELECT * FROM complaints";
    const params = [];
    const conditions = [];
    if (status) {
      conditions.push("status=?");
      params.push(status);
    }
    if (search) {
      conditions.push(
        "(institution_name LIKE ? OR tracking_id LIKE ? OR full_name LIKE ?)"
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
    sql += " ORDER BY created_at DESC";
    const [rows] = await db.query(sql, params);
    return rows.map((r) => ({
      ...r,
      evidence_files: safeParse(r.evidence_files, []),
    }));
  },

  getById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid complaint ID");
    const [rows] = await db.query("SELECT * FROM complaints WHERE id=?", [id]);
    if (!rows.length) return null;
    return {
      ...rows[0],
      evidence_files: safeParse(rows[0].evidence_files, []),
    };
  },

  getByTrackingId: async (trackingId) => {
    if (!trackingId) throw new Error("Tracking ID required");
    const [rows] = await db.query(
      "SELECT * FROM complaints WHERE tracking_id=?",
      [trackingId]
    );
    if (!rows.length) return null;
    return {
      ...rows[0],
      evidence_files: safeParse(rows[0].evidence_files, []),
    };
  },

  updateById: async (id, data) => {
    if (!id || isNaN(id)) throw new Error("Invalid complaint ID");
    const {
      full_name,
      age,
      gender,
      submission_type,
      group_members,
      city,
      sub_city,
      woreda,
      house_number,
      phone_number,
      email,
      physical_condition,
      institution_name,
      complaint_content,
      desired_solution,
      evidence_files,
      status,
      admin_response,
    } = data;

    const sql = `
      UPDATE complaints SET
        full_name=COALESCE(?,full_name), age=COALESCE(?,age), gender=COALESCE(?,gender),
        submission_type=COALESCE(?,submission_type), group_members=COALESCE(?,group_members),
        city=COALESCE(?,city), sub_city=COALESCE(?,sub_city), woreda=COALESCE(?,woreda),
        house_number=COALESCE(?,house_number), phone_number=COALESCE(?,phone_number),
        email=COALESCE(?,email), physical_condition=COALESCE(?,physical_condition),
        institution_name=COALESCE(?,institution_name), complaint_content=COALESCE(?,complaint_content),
        desired_solution=COALESCE(?,desired_solution), evidence_files=COALESCE(?,evidence_files),
        status=COALESCE(?,status), admin_response=COALESCE(?,admin_response)
      WHERE id=?
    `;
    const [result] = await db.query(sql, [
      full_name,
      age,
      gender,
      submission_type,
      group_members,
      city,
      sub_city,
      woreda,
      house_number,
      phone_number,
      email,
      physical_condition,
      institution_name,
      complaint_content,
      desired_solution,
      evidence_files ? JSON.stringify(evidence_files) : null,
      status,
      admin_response,
      id,
    ]);
    if (result.affectedRows === 0)
      throw new Error("Complaint not found or no changes made");
    return { id, ...data };
  },

  updateStatus: async (id, status) => {
    if (!id || isNaN(id)) throw new Error("Invalid complaint ID");
    if (!["pending", "in_review", "resolved", "rejected"].includes(status))
      throw new Error("Invalid status");
    const [result] = await db.query(
      "UPDATE complaints SET status=? WHERE id=?",
      [status, id]
    );
    if (result.affectedRows === 0) throw new Error("Complaint not found");
    return { id, status };
  },

  updateAdminResponse: async (id, admin_response) => {
    if (!id || isNaN(id)) throw new Error("Invalid complaint ID");
    if (!admin_response || typeof admin_response !== "string")
      throw new Error("Admin response required");
    const [result] = await db.query(
      "UPDATE complaints SET admin_response=? WHERE id=?",
      [admin_response, id]
    );
    if (result.affectedRows === 0) throw new Error("Complaint not found");
    return { id, admin_response };
  },

  deleteById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid complaint ID");
    const [result] = await db.query("DELETE FROM complaints WHERE id=?", [id]);
    if (result.affectedRows === 0) throw new Error("Complaint not found");
    return result;
  },

  getStats: async () => {
    const [stats] = await db.query(`
      SELECT status, COUNT(*) AS count,
        IFNULL((COUNT(*)*100/(SELECT COUNT(*) FROM complaints)),0) AS percentage
      FROM complaints GROUP BY status
    `);
    return stats;
  },
};

module.exports = ComplaintModel;
