# Portfolio Server API

This is the API server for the portfolio website. It's built with Express.js and MongoDB, and is designed to be deployed on Vercel.

## Setup for Vercel Deployment

This project has been configured for deployment on Vercel's serverless platform. The key components include:

1. `/api/index.js` - The main Express app entry point for Vercel serverless functions
2. `vercel.json` - Configuration for Vercel deployment
3. `public/index.html` - A simple landing page for the API root

## Environment Variables

Make sure to set up the following environment variables in your Vercel project settings:

- `DATABASE_STRING` - MongoDB connection string
- `SECRET_KEY` - JWT secret key for authentication

## API Endpoints

### Public Endpoints

- `GET /api/test` - Test if the API is working
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/:id` - Get a specific blog post
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/:projectId` - Get a specific project

### Admin Endpoints (Require Authentication)

- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get admin profile
- `GET /api/admin/blogs` - Get all blog posts (admin)
- `POST /api/admin/blogs` - Create a new blog post
- `PUT /api/admin/blogs/:blogId` - Update a blog post
- `DELETE /api/admin/blogs/:blogId` - Delete a blog post
- `GET /api/admin/projects` - Get all projects (admin)
- `POST /api/admin/projects` - Create a new project
- `PUT /api/admin/projects/:projectId` - Update a project
- `DELETE /api/admin/projects/:projectId` - Delete a project

## Local Development

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. The server will run on `http://localhost:3000`

## Deployment to Vercel

1. Connect your GitHub repository to Vercel
2. Configure the environment variables
3. Deploy! 