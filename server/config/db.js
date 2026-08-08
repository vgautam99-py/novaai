import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/novaai');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.log('Ensure local MongoDB is running at mongodb://127.0.0.1:27017/novaai or MONGO_URI env is configured.');
    process.exit(1);
  }
};

export default connectDB;
