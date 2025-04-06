const express = require('express');
const { Blog, Admin, Project } = require("../db/config");
const jwt = require('jsonwebtoken');
const { SECRET, authenticateJwt } = require("../middleware/auth");

const router = express.Router();

// Get admin profile
router.get("/me", authenticateJwt, async (req, res) => {
    const admin = await Admin.findOne({ username: req.user.username });
    if (!admin) {
      res.status(403).json({msg: "Admin doesn't exist"});
      return;
    }
    res.json({
        username: admin.username
    });
});

// Admin login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });
    
    if (admin) {
        const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
        res.json({ message: "Logged in successfully", token });
    } else {
        res.status(403).json({ message: "Invalid username or password" });
    }
});

// Create a new blog post
router.post("/blogs", authenticateJwt, async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;
        
        // Get the count of existing blogs to determine the next ID
        const count = await Blog.countDocuments();
        const blogId = count + 1;
        
        const newBlog = new Blog({ 
            title, 
            content, 
            imageUrl,
            blogId,
            date: new Date()
        });
        
        await newBlog.save();
        res.json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all blog posts
router.get("/blogs", authenticateJwt, async (req, res) => {
    const blogs = await Blog.find({});
    res.json({ blogs });
});

// Get a specific blog post
router.get("/blogs/:blogId", authenticateJwt, async (req, res) => {
    const blog = await Blog.findById(req.params.blogId);
    if (blog) {
        res.json({ blog });
    } else {
        res.status(404).json({ message: "Blog not found" });
    }
});

// Update a blog post
router.put("/blogs/:blogId", authenticateJwt, async (req, res) => {
    const { title, content, imageUrl } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.blogId, 
        { title, content, imageUrl },
        { new: true }
    );
    
    if (updatedBlog) {
        res.json({ message: "Blog updated successfully", blog: updatedBlog });
    } else {
        res.status(404).json({ message: "Blog not found" });
    }
});

// Delete a blog post
router.delete("/blogs/:blogId", authenticateJwt, async (req, res) => {
    const result = await Blog.findByIdAndDelete(req.params.blogId);
    
    if (result) {
        res.json({ message: "Blog deleted successfully" });
    } else {
        res.status(404).json({ message: "Blog not found" });
    }
});

// Get all projects (admin route)
router.get("/projects", authenticateJwt, async (req, res) => {
    try {
        const projects = await Project.find({}).sort({ date: -1 });
        res.json({ projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific project by ID (admin route)
router.get("/projects/:projectId", authenticateJwt, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        
        res.json({ project });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new project
router.post("/projects", authenticateJwt, async (req, res) => {
    try {
        const { title, description, summary, technologies, imageUrl, videoUrl, githubUrl, liveUrl, featured } = req.body;
        
        const newProject = new Project({
            title,
            description,
            summary,
            technologies: Array.isArray(technologies) ? technologies : technologies.split(',').map(tech => tech.trim()),
            imageUrl,
            videoUrl,
            githubUrl,
            liveUrl,
            featured: featured || false,
            date: new Date()
        });
        
        await newProject.save();
        res.status(201).json({ message: "Project created successfully", project: newProject });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a project
router.put("/projects/:projectId", authenticateJwt, async (req, res) => {
    try {
        const { title, description, summary, technologies, imageUrl, videoUrl, githubUrl, liveUrl, featured } = req.body;
        
        const project = await Project.findById(req.params.projectId);
        
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        
        project.title = title || project.title;
        project.description = description || project.description;
        project.summary = summary || project.summary;
        
        if (technologies) {
            project.technologies = Array.isArray(technologies) 
                ? technologies 
                : technologies.split(',').map(tech => tech.trim());
        }
        
        project.imageUrl = imageUrl || project.imageUrl;
        project.videoUrl = videoUrl || project.videoUrl;
        project.githubUrl = githubUrl || project.githubUrl;
        project.liveUrl = liveUrl || project.liveUrl;
        project.featured = featured !== undefined ? featured : project.featured;
        
        await project.save();
        res.json({ message: "Project updated successfully", project });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a project
router.delete("/projects/:projectId", authenticateJwt, async (req, res) => {
    try {
        const result = await Project.findByIdAndDelete(req.params.projectId);
        
        if (result) {
            res.json({ message: "Project deleted successfully" });
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;