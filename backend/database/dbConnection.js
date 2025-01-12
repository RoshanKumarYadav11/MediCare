import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "MEDICARE",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw new Error(error);
  }
};
