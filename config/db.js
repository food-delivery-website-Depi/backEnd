import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://mahmoudhossam219200:Khodary12345@cluster0.a0qzr.mongodb.net/food-delivery",
      {
        serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      }
    )
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err.message));
};
