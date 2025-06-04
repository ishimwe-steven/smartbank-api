const pool = require('../db');

// ✅ Send Money
exports.sendMoney = async (req, res) => {
  const { sender_id, receiver_email } = req.body;
  const amount = parseFloat(req.body.amount);

  if (!sender_id || !receiver_email || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Missing or invalid required fields' });
  }

  try {
    const receiverRes = await pool.query('SELECT * FROM users WHERE email = $1', [receiver_email]);
    if (receiverRes.rows.length === 0) return res.status(404).json({ message: 'Receiver not found' });
    const receiver = receiverRes.rows[0];

    const senderRes = await pool.query('SELECT * FROM users WHERE id = $1', [sender_id]);
    if (senderRes.rows.length === 0) return res.status(404).json({ message: 'Sender not found' });
    const sender = senderRes.rows[0];

    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Start transaction
    await pool.query('BEGIN');

    await pool.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, sender_id]);
    await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [amount, receiver.id]);
    await pool.query(
      'INSERT INTO transactions (sender_id, receiver_id, amount) VALUES ($1, $2, $3)',
      [sender_id, receiver.id, amount]
    );

    await pool.query('COMMIT');
    res.status(200).json({ message: 'Transaction completed' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Transaction error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Transaction History
exports.getTransactionHistory = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'Missing user ID' });
  }

  const sql = `
    SELECT 
      t.id,
      u1.name AS sender_name,
      u2.name AS receiver_name,
      t.sender_id,
      t.receiver_id,
      t.amount,
      t.created_at
    FROM transactions t
    JOIN users u1 ON t.sender_id = u1.id
    JOIN users u2 ON t.receiver_id = u2.id
    WHERE t.sender_id = $1 OR t.receiver_id = $1
    ORDER BY t.created_at DESC
  `;

  try {
    const result = await pool.query(sql, [user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ DB Error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Fake Deposit
exports.deposit = async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid deposit request' });
  }

  try {
    await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [amount, userId]);
    res.status(200).json({ message: 'Deposit successful', amount });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// ✅ Fake Withdraw
exports.withdraw = async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid withdraw request' });
  }

  try {
    const result = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const balance = result.rows[0].balance;
    if (balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    await pool.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, userId]);
    res.status(200).json({ message: 'Withdraw successful', amount });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
