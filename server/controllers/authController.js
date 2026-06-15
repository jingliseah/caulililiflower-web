import db from "../db/index.js";
import bcrypt from "bcrypt";

export async function loginUser(req, res, next) {
  const { username, password } = req.body;

  try {
    // find user
    const { rows } = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // compare password
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // success (for now just return user)
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}