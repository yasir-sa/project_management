require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { syncDB } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'promanage_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'lax' },
}));

app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/projects',  require('./routes/projectRoutes'));
app.use('/api/messages',  require('./routes/messageRoutes'));

app.get('/', (req, res) => res.json({ message: 'ProManage API running!' }));

syncDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
