require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRouter = require("../routes/admin");

// Initialize the Express app
const app = express();

// CORS Configuration
const allowedOrigins = ['https://farzaanali.com', 'http://localhost:3001', 'http://localhost:3000','portfolio-rlo0.onrender.com','www.farzaanali.com'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
};

// Enable pre-flight requests for all routes
app.options('*', cors(corsOptions));

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Simple test route to verify the API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working properly!' });
});

// Main routes
app.use("/api/admin", adminRouter);

// Public API routes for blog posts
app.get('/api/blogs', async (req, res) => {
  try {
    const { Blog } = require('../db/config');
    const blogs = await Blog.find({}).sort({ date: -1 });
    res.json({ blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/blogs/:id', async (req, res) => {
  try {
    const { Blog } = require('../db/config');
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json({ blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public API routes for projects
app.get('/api/projects/featured', async (req, res) => {
  try {
    const { Project } = require('../db/config');
    const projects = await Project.find({ featured: true }).sort({ date: -1 });
    res.json({ projects });
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/projects/:projectId', async (req, res) => {
  try {
    const { Project } = require('../db/config');
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const { Project } = require('../db/config');
    const projects = await Project.find({}).sort({ date: -1 });
    res.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Database connection
const connectDB = async () => {
  try {
    const db_string = process.env.DATABASE_STRING;
    await mongoose.connect(db_string, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
      dbName: "portfolio" 
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit the process in serverless environment
    // Instead, let the function continue and handle the error appropriately
  }
};

// Connect to MongoDB
connectDB();

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the Express app for Vercel
module.exports = app; 