import mongoose from "mongoose";
const connectToDB = (database: string)=> {
    mongoose.set('strictQuery', false);
    return  mongoose.connect(database);
}
export default connectToDB;

