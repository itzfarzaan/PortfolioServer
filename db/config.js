const mongoose = require("mongoose");
// Define mongoose schemas
const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: {
        type: Date,
        default: Date.now
    },
    imageUrl: String,
    blogId: Number
});

const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Project schema for technical projects
const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    summary: String,
    technologies: [String],
    imageUrl: String,
    videoUrl: String,
    githubUrl: String,
    liveUrl: String,
    featured: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Blog = mongoose.model('Blog', blogSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Project = mongoose.model('Project', projectSchema);

module.exports = {
    Blog,
    Admin,
    Project
}
