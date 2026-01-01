import mongoose from "mongoose";

 const connectDB = async () => {
    try {
       
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ 🔗 connected to mongodb: ${conn.connection.host}`);

    } catch (error) {
        
        console.log(`⚠️ failed to connect to mongodb: ${error}`);

    }
};

export default connectDB;