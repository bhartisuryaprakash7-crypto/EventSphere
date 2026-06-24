const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options prevent deprecation warnings
     
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Connection event listeners
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting reconnect...');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err.message);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error; // Let server.js handle exit
  }
};

module.exports = { connectDB };