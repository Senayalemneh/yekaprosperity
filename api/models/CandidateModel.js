const db = require("../config/db");

// Safe JSON parse helper
const safeParse = (data, defaultValue) => {
  if (typeof data === "object") return data;
  if (!data) return defaultValue;

  try {
    return JSON.parse(data);
  } catch (err) {
    console.error("JSON parse error:", err);
    return defaultValue;
  }
};

const CandidateModel = {
  create: async (data) => {
    const {
      name = {},
      party = {},
      photo_url,
      age,
      bio = {},
      policies = [],
      region,
      election_type,
      status = 'active',
      social_links = {},
    } = data;

    // Validation
    if (!name.en || name.en.trim() === '') throw new Error("Name must include at least English translation");
    if (!party.en || party.en.trim() === '') throw new Error("Party must include at least English translation");
    if (!age) throw new Error("Age is required");
    if (!bio.en || bio.en.trim() === '') throw new Error("Bio must include at least English translation");
    if (!region) throw new Error("Region is required");
    if (!election_type) throw new Error("Election type is required");
    
    if (age && (isNaN(age) || age < 18 || age > 120)) {
      throw new Error("Age must be a valid number between 18 and 120");
    }

    const sql = `
      INSERT INTO candidates (
        name, party, photo_url, age, bio, policies, region, election_type, status, social_links
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await db.query(sql, [
        JSON.stringify(name),
        JSON.stringify(party),
        photo_url || null,
        age,
        JSON.stringify(bio),
        JSON.stringify(policies),
        region,
        election_type,
        status,
        JSON.stringify(social_links),
      ]);

      return { 
        id: result.insertId, 
        ...data
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create candidate");
    }
  },

  getAll: async () => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM candidates ORDER BY created_at DESC"
      );
      return rows.map((row) => ({
        id: row.id,
        name: safeParse(row.name, {}),
        party: safeParse(row.party, {}),
        photo_url: row.photo_url,
        age: row.age,
        bio: safeParse(row.bio, {}),
        policies: safeParse(row.policies, []),
        region: row.region,
        election_type: row.election_type,
        status: row.status,
        social_links: safeParse(row.social_links, {}),
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch candidates");
    }
  },

  getById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid candidate ID");

    try {
      const [rows] = await db.query("SELECT * FROM candidates WHERE id = ?", [id]);
      if (!rows.length) return null;

      const row = rows[0];
      return {
        id: row.id,
        name: safeParse(row.name, {}),
        party: safeParse(row.party, {}),
        photo_url: row.photo_url,
        age: row.age,
        bio: safeParse(row.bio, {}),
        policies: safeParse(row.policies, []),
        region: row.region,
        election_type: row.election_type,
        status: row.status,
        social_links: safeParse(row.social_links, {}),
        created_at: row.created_at,
        updated_at: row.updated_at
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch candidate");
    }
  },

  updateById: async (id, data) => {
    if (!id || isNaN(id)) throw new Error("Invalid candidate ID");

    const {
      name,
      party,
      photo_url,
      age,
      bio,
      policies,
      region,
      election_type,
      status,
      social_links,
    } = data;

    const sql = `
      UPDATE candidates SET 
        name = COALESCE(?, name),
        party = COALESCE(?, party),
        photo_url = COALESCE(?, photo_url),
        age = COALESCE(?, age),
        bio = COALESCE(?, bio),
        policies = COALESCE(?, policies),
        region = COALESCE(?, region),
        election_type = COALESCE(?, election_type),
        status = COALESCE(?, status),
        social_links = COALESCE(?, social_links),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    try {
      const [result] = await db.query(sql, [
        name ? JSON.stringify(name) : null,
        party ? JSON.stringify(party) : null,
        photo_url || null,
        age || null,
        bio ? JSON.stringify(bio) : null,
        policies ? JSON.stringify(policies) : null,
        region || null,
        election_type || null,
        status || null,
        social_links ? JSON.stringify(social_links) : null,
        id,
      ]);

      if (result.affectedRows === 0)
        throw new Error("Candidate not found or no changes made");

      return { id, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update candidate");
    }
  },

  deleteById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid candidate ID");

    try {
      const [result] = await db.query("DELETE FROM candidates WHERE id = ?", [id]);
      if (result.affectedRows === 0) throw new Error("Candidate not found");
      return result;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete candidate");
    }
  },

  // Additional utility methods
  getByRegion: async (region) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM candidates WHERE region = ? ORDER BY name ASC",
        [region]
      );
      return rows.map((row) => ({
        id: row.id,
        name: safeParse(row.name, {}),
        party: safeParse(row.party, {}),
        photo_url: row.photo_url,
        age: row.age,
        bio: safeParse(row.bio, {}),
        policies: safeParse(row.policies, []),
        region: row.region,
        election_type: row.election_type,
        status: row.status,
        social_links: safeParse(row.social_links, {}),
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch candidates by region");
    }
  },

  getByElectionType: async (electionType) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM candidates WHERE election_type = ? ORDER BY name ASC",
        [electionType]
      );
      return rows.map((row) => ({
        id: row.id,
        name: safeParse(row.name, {}),
        party: safeParse(row.party, {}),
        photo_url: row.photo_url,
        age: row.age,
        bio: safeParse(row.bio, {}),
        policies: safeParse(row.policies, []),
        region: row.region,
        election_type: row.election_type,
        status: row.status,
        social_links: safeParse(row.social_links, {}),
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch candidates by election type");
    }
  },

  getByStatus: async (status) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM candidates WHERE status = ? ORDER BY name ASC",
        [status]
      );
      return rows.map((row) => ({
        id: row.id,
        name: safeParse(row.name, {}),
        party: safeParse(row.party, {}),
        photo_url: row.photo_url,
        age: row.age,
        bio: safeParse(row.bio, {}),
        policies: safeParse(row.policies, []),
        region: row.region,
        election_type: row.election_type,
        status: row.status,
        social_links: safeParse(row.social_links, {}),
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch candidates by status");
    }
  }
};

module.exports = CandidateModel;