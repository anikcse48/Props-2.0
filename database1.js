import * as SQLite from 'expo-sqlite/next';

const db = SQLite.openDatabase('app.db');

export const initDB = async () => {
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      name TEXT,
      phone TEXT,
      address TEXT,
      profile_image TEXT
    )
  `);
};

// Insert or update user (for register or profile update)
export const upsertUser = async ({ id, username, password, name, phone, address, profile_image }) => {
  if (id) {
    // Update existing user by id
    await db.runAsync(
      `UPDATE users SET name = ?, phone = ?, address = ?, profile_image = ? WHERE id = ?`,
      [name, phone, address, profile_image, id]
    );
  } else {
    // Insert new user
    await db.runAsync(
      `INSERT INTO users (username, password, name, phone, address, profile_image) VALUES (?, ?, ?, ?, ?, ?)`,
      [username, password, name, phone, address, profile_image]
    );
  }
};

// Get user by username (for login)
export const getUserByUsername = async (username) => {
  const user = await db.getAsync(`SELECT * FROM users WHERE username = ?`, [username]);
  return user;
};

// Get user by ID (for loading profile)
export const getUserById = async (id) => {
  const user = await db.getAsync(`SELECT * FROM users WHERE id = ?`, [id]);
  return user;
};
