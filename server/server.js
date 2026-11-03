
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

dotenv.config();

const app = express();

// Port configuration
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'SprintBoard Server is running successfully!'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/issues', issueRoutes);

// Connect MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`SprintBoard server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Server startup error:', error.message);
    process.exit(1);
  }
};

startServer();
