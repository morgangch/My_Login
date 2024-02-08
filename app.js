const express = require('express');
const crypto = require('crypto');
const path = require('path');
const app = express();
const port = 3000;

//const hashedValue = crypto.createHash('sha256').update('Hello, World!').digest('hex');
// Serve static files from the current directory
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'homepage', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login', 'index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup', 'index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'welcome', 'index.html'));
});

app.get('/scripts.js', (req, res) => {
  const scriptPath = path.join(__dirname, 'scripts.js');
  res.sendFile(scriptPath);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
