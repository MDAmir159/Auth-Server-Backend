// config/dbConfig.ts
import mongoose from 'mongoose';
import config from '.';

const { DB_HOST, MONGO_PORT, DB_NAME } = config;

const connectToMongoDB = async () => {
    const mongoURI = `mongodb://${DB_HOST}:${MONGO_PORT}/${DB_NAME}`;

    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

export default connectToMongoDB;
