import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import uidsRoutes from './routes/uids.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration de la session
if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET doit être défini dans les variables d\'environnement');
}

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI doit être défini dans les variables d\'environnement');
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
      httpOnly: true,
      secure: false, // Désactivé pour le développement local
      sameSite: 'lax', // 'lax' pour le développement local
    },
  })
);

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/uids', uidsRoutes);

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'API Invader Comparator' });
});

// Connexion à MongoDB et démarrage du serveur
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
