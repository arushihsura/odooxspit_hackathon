import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (userExists.rows.length > 0)
    return res.json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users(name, email, password) VALUES($1,$2,$3)",
    [name, email, hashed]
  );

  res.json({ message: "User registered" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const data = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (data.rows.length === 0)
    return res.json({ error: "User not found" });

  const user = data.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.json({ error: "Invalid password" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
};
