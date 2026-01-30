import chalk from "chalk"
import mongoose from "mongoose";
import 'dotenv/config'

export const connectDB = async() => {
const errorDB = chalk.red;
const successDB = chalk.cyan.underline
const URI = process.env.MONGO_URI;

try {
if(!URI) throw new Error(`Mongo URI wasn't found`);
const conn = await mongoose.connect(URI);
console.log(successDB(`MongoDB connected successfully at ${conn.connection.host}`))
return conn;
} catch (error) {
    console.error(errorDB('Error connecting to MongoDB: ', (error as Error).message))
    process.exit(1);
}
}