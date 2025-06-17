const express = require('express');
const path = require('path');
const session = require('express-session');
const routes = require('./routes/routes');
const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');
// const menuRoutes = require('./routes/menuRoutes');
// const cajeroRoutes = require('./routes/cajeroRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // Procesa datos JSON
app.use(express.urlencoded({ extended: true })); // Procesa datos de formularios
app.use(cors()); // Habilita CORS
app.use(session({
  secret: 'tu-secreto-seguro',
  resave: false,
  saveUninitialized: true
}));

global.apiUrl = 'https://backendrg.theinnovatesoft.xyz';

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/src', express.static('src'));
app.use('/', routes);



// app.use('/auth', authRoutes);
// app.use('/menu', menuRoutes);
// app.use('/cajero', cajeroRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});