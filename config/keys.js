// Configuration settings for backend

module.exports = {
  // JWT Secret key for authentication
  JWT_SECRET: 'your_jwt_secret_key_should_be_long_and_secure_in_production',
  
  // MongoDB connection string (if needed)
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://nminhchaudev:nminhchaudev@cluster0.dohl7d1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  
  // Other configuration settings
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development'
};