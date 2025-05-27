import express from 'express';
import http from 'http';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { Server as IOServer } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new IOServer(server);

// 📂 Configuration des sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'changeme',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2h
}));

// 👁‍🗨 EJS + statics
app.set('view engine', 'ejs');
app.set('views', resolve(__dirname, 'views'));
app.use('/public', express.static(resolve(__dirname, 'public')));

// 🗄️ Utilisateurs (exemple hard-codé)
const users = [
  {
    username: 'admin',
    hash: bcrypt.hashSync('admin', 10)
  }
];
// 🔒 Middleware d’authentification
function ensureAuth(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}

// 🚪 Routes d’authentification
app.get('/login', (_, res) => res.render('login'));
app.post('/login', express.urlencoded({ extended: false }), (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user && bcrypt.compareSync(password, user.hash)) {
    req.session.user = username;
    return res.redirect('/');
  }
  res.render('login', { error: 'Identifiants invalides' });
});
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// 🏠 Route principale protégée
app.get('/', ensureAuth, (req, res) => {
  res.render('index', { user: req.session.user });
});

// 📂 Chemins vers les données
const dataDir      = resolve(process.cwd(), 'data');
const warnsPath    = resolve(dataDir, 'warns.json');
const bansPath     = resolve(dataDir, 'bans.json');
const antiraidPath = resolve(dataDir, 'antiraid.json');

// 🌐 Socket.IO en temps réel
io.on('connection', socket => {
  const warnsData  = fs.existsSync(warnsPath)    ? JSON.parse(fs.readFileSync(warnsPath))    : {};
  const bansData   = fs.existsSync(bansPath)     ? JSON.parse(fs.readFileSync(bansPath))     : {};
  const antiConfig = fs.existsSync(antiraidPath) ? JSON.parse(fs.readFileSync(antiraidPath)) : {};

  socket.emit('initialData', {
    warns:    warnsData['default']  || [],
    bans:     bansData['default']   || [],
    antiraid: antiConfig['default'] || false
  });

  socket.on('toggleAntiraid', () => {
    const newState = !antiConfig['default'];
    antiConfig['default'] = newState;
    fs.writeFileSync(antiraidPath, JSON.stringify(antiConfig, null, 2));
    io.emit('antiraidChanged', newState);
  });

  socket.on('clearWarn', idx => {
    const list = warnsData['default'] || [];
    if (list[idx]) list.splice(idx, 1);
    fs.writeFileSync(warnsPath, JSON.stringify({ default: list }, null, 2));
    io.emit('warnsUpdated', list);
  });

  socket.on('clearBan', idx => {
    const list = bansData['default'] || [];
    if (list[idx]) list.splice(idx, 1);
    fs.writeFileSync(bansPath, JSON.stringify({ default: list }, null, 2));
    io.emit('bansUpdated', list);
  });
});

// 📢 Expose l’instance io
export { io };

// 🚀 Démarrage du serveur
server.listen(3000, () => {
  console.log('🌐 Dashboard sécurisé sur http://localhost:3000');
});
