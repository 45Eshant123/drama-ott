import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dramastream';
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        logger.info('MongoDB connected successfully');
        return mongoose.connection;
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
