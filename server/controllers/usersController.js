import db from "../db/index.js";
import bcrypt from "bcrypt";

// Get all users
export async function getUsers(req, res, next) {
  try {
    const { rows } = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// Get user by ID
export async function getUsersByID(req, res, next) {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    res.status(200).json({
      message: "User fetched successfully",
      users: rows
    });
  } catch (err) {
    next(err);
  }
}

// Create user
export async function createUser(req, res, next) {
  const { username, email, contact, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (username, email, contact_number, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, contact_number`,
      [username, email, contact, hash]
    );  

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Edit user
export async function updateUser(req, res, next) {
  const { username, email, contact, password } = req.body;
  const { id } = req.params;

  try {
    let query;
    let values;

    if (password) {
      const hash = await bcrypt.hash(password, 10);

      query = `
        UPDATE users
        SET username = $1,
            email = $2,
            contact_number = $3,
            password_hash = $4
        WHERE id = $5
        RETURNING id, username, email, contact_number
      `;

      values = [username, email, contact, hash, id];
    } else {
      query = `
        UPDATE users
        SET username = $1,
            email = $2,
            contact_number = $3
        WHERE id = $4
        RETURNING id, username, email, contact_number
      `;

      values = [username, email, contact, id];
    }

    const result = await db.query(query, values);

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Delete user
export async function deleteUser(req, res, next) {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM users WHERE id = $1", [id]);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
}