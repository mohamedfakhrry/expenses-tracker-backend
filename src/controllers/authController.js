const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  const { phone_number, password } = req.body;

  // خطوة 1: تأكد إن البيانات المطلوبة موجودة
  if (!phone_number || !password) {
    return res.status(400).json({ error: 'Phone number and password are required' });
  }

  try {
    // خطوة 2: تأكد إن الرقم مش مسجل قبل كده
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE phone_number = $1',
      [phone_number]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Phone number already registered' });
    }

    // خطوة 3: شفر الباسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // خطوة 4: احفظ اليوزر الجديد
    const newUser = await pool.query(
      'INSERT INTO users (phone_number, password) VALUES ($1, $2) RETURNING id, phone_number',
      [phone_number, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}



async function login(req, res) {
  const { phone_number, password } = req.body;

  if (!phone_number || !password) {
    return res.status(400).json({ error: 'Phone number and password are required' });
  }

  try {
    // خطوة 1: هات اليوزر بناءً على رقم التليفون
    const result = await pool.query(
      'SELECT * FROM users WHERE phone_number = $1',
      [phone_number]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid phone number or password' });
    }

    const user = result.rows[0];

    // خطوة 2: قارن الباسورد اللي بعته المستخدم بالـ hash المخزن
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid phone number or password' });
    }

    // خطوة 3: ولّد JWT token
    const token = jwt.sign(
      { user_id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // خطوة 4: رجع الـ token
    res.status(200).json({ message: 'Login successful', token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

module.exports = { register, login };
