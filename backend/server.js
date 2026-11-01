const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware - allow localhost and any vercel or custom origin
const allowedOrigins = [
  'http://localhost:3000',
  'https://mini-project-manager-ten.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for assignment demo review
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api', require('./routes/task.routes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Mini Project Manager API is running' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
