const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

const users = {
  'admin': 'password123',
  'test': 'test123'
};

app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connexion</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      width: 90%;
      max-width: 350px;
    }
    h1 { text-align: center; margin-bottom: 1.5rem; color: #333; }
    input {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    button {
      width: 100%;
      padding: 10px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      font-weight: bold;
      cursor: pointer;
    }
    button:hover { background: #5568d3; }
    .error { color: red; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Connexion</h1>
    ${req.query.error ? '<p class="error">' + req.query.error + '</p>' : ''}
    <form method="POST" action="/login">
      <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Se connecter</button>
    </form>
    <p style="text-align: center; margin-top: 1rem; font-size: 12px; color: #666;">
      Test: admin / password123
    </p>
  </div>
</body>
</html>`);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] === password) {
    req.session.user = username;
    res.redirect('/dashboard');
  } else {
    res.redirect('/?error=Identifiant ou mot de passe incorrect');
  }
});

app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      padding: 2rem;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 { color: #667eea; margin-bottom: 1rem; }
    button {
      background: #667eea;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 1rem;
    }
    button:hover { background: #5568d3; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Bienvenue ${req.session.user} 👋</h1>
    <p>Vous êtes connecté !</p>
    <form method="POST" action="/logout">
      <button type="submit">Déconnexion</button>
    </form>
  </div>
</body>
</html>`);
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
