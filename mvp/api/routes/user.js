import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../db.js';

const router = express.Router();
const JWT_SECRET = '123k321';
const SALT_ROUNDS = 10;

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed],
      (err) => {
        if (err) {
          console.error('Registration error:', err);
          return res.status(500).json({ error: 'Registration failed' });
        }
        res.json({ message: 'User created' });
      }
    );
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Login DB error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) return res.status(401).json({ error: 'Invalid login' });

    const user = results[0];
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) return res.status(401).json({ error: 'Invalid login' });

    const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

export { router as userRoutes };
