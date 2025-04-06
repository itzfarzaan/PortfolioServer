require('dotenv').config();
const mongoose = require('mongoose');
const { Admin } = require('../db/config');

// Connect to MongoDB
const db_string = process.env.DATABASE_STRING;
mongoose.connect(db_string, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "portfolio" })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      // Create a new admin user
      const admin = new Admin({
        username: 'admin',
        password: 'admin123' // You should change this to a secure password
      });
      
      await admin.save();
      console.log('Admin user created successfully');
    }
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.connection.close();
  }
}

createAdminUser();
