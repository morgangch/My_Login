const express = require('express');
const crypto = require('crypto');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const { get } = require('http');
const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  password: '1234',
  database: 'user_details',
  port: 5432,
});

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: '1234',
  resave: false,
  saveUninitialized: true,
}));

async function isValidUserLog(username, hashedPassword) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE (username = $1 OR email = $1) AND password = $2', [username, hashedPassword]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking user validity:', error.message);
    return false;
  }
}

async function isValidUserSign(username, hashedPassword, mail) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, hashedPassword]);
    return result.rows.length == 0;
  } catch (error) {
    console.error('Error checking user validity:', error.message);
    return false;
  }
}

async function getUsername(username) {
  try {
    const result = await pool.query('SELECT username FROM users WHERE (username = $1 OR email = $1)', [username]);
    return result.rows[0].username;
  } catch (error) {
    console.error('Error getting username:', error.message);
    return null;
  }
}

async function getUsermail(username) {
  try {
    const result = await pool.query('SELECT email FROM users WHERE (username = $1 OR email = $1)', [username]);
    return result.rows[0].email;
  } catch (error) {
    console.error('Error getting email:', error.message);
    return null;
  }
}

function checkPasswordValidity(password) {
  if (password.length < 8)
    return false;
  if (!/[A-Z]/.test(password))
    return false;
  if (!/[a-z]/.test(password))
    return false;
  if (!/\d/.test(password))
    return false;
  if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password))
    return false;
  return true;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'homepage', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login', 'index.html'));
});

app.post('/login', async (req, res) => {
  const usernameValue = req.body.username;
  const passwordValue = req.body.password;

  if (!usernameValue || !passwordValue)
    return res.status(400).send('Invalid request. Username and password are required.');
  if (!checkPasswordValidity(passwordValue))
    return res.status(400).send('Password is not valid. Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
  const hashedValue = crypto.createHash("sha256").update(`${passwordValue}`).digest("hex");
  if (!(await isValidUserLog(usernameValue, hashedValue)))
    return res.status(401).send('Invalid username or password.');
  req.session.username = String(await getUsername(usernameValue));
  req.session.mail = String(await getUsermail(usernameValue));
  res.redirect('/home');
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup', 'index.html'));
});

app.post('/signup', async (req, res) => {
  const usernameValue = req.body.username;
  const passwordValue = req.body.password;
  const mailValue = req.body.mail;

  if (!usernameValue || !passwordValue || !mailValue)
    return res.status(400).send('Invalid request. Username, password and email are required.');
  if (!checkPasswordValidity(passwordValue))
    return res.status(400).send('Password is not valid. Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
  const hashedValue = crypto.createHash("sha256").update(`${passwordValue}`).digest("hex");

  if (!(await isValidUserSign(usernameValue, hashedValue, mailValue)))
    return res.status(401).send('Invalid username or password.');
  try {
    await pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [usernameValue, hashedValue, mailValue]);
  } catch (error) {
    console.error('Error signing up:', error.message);
    return res.status(500).send('Error signing up.');
  }
  req.session.username = usernameValue;
  req.session.mail = mailValue;
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'welcome', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
