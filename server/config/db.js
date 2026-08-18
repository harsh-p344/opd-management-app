import mongoose from 'mongoose';

const DEFAULT_MONGO_URI = 'mongodb://localhost:27017/opd-management-app';

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;

  try {
    mongoose.set('strictQuery', false);
    mongoose.connection.on('connected', () => {
      console.log(`MongoDB connected: ${mongoUri}`);
    });

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    await mongoose.connect(mongoUri);
    return true;
  } catch (error) {
    console.error('Unable to connect to MongoDB at:', mongoUri);
    console.error(error.message);
    throw error;
  }
};

export default connectDB;
