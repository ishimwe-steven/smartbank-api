const pool = require('../db');

// ✅ Get user by ID (e.g., /api/users/5)
exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT id, name, email, balance FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// ✅ Get current authenticated user info (requires auth middleware)
exports.getUserInfo = async (req, res) => {
  const userId = req.user.id; // From JWT middleware

  try {
    const result = await pool.query(
      'SELECT id, name, email, balance FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
