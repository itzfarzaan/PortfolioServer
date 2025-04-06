require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRouter = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/admin", adminRouter);

// Public API route for blog posts (no authentication required)
app.get('/api/blogs', async (req, res) => {
  try {
    const { Blog } = require('./db/config');
    const blogs = await Blog.find({}).sort({ date: -1 });
    res.json({ blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public API route for retrieving a specific blog post by ID
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const { Blog } = require('./db/config');
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

// Public API route for featured projects
app.get('/api/projects/featured', async (req, res) => {
  try {
    const { Project } = require('./db/config');
    const projects = await Project.find({ featured: true }).sort({ date: -1 });
    res.json({ projects });
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public API route for retrieving a specific project by ID
app.get('/api/projects/:projectId', async (req, res) => {
  try {
    const { Project } = require('./db/config');
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

// Public API route for projects (no authentication required)
app.get('/api/projects', async (req, res) => {
  try {
    const { Project } = require('./db/config');
    const projects = await Project.find({}).sort({ date: -1 });
    res.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Connecting to MongoDB
const db_string = process.env.DATABASE_STRING;
mongoose.connect(db_string, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "portfolio" })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));