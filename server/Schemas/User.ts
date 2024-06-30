import mongoose from "mongoose";
import ChatRoom from "./ChatRoom";
const { Schema } = mongoose;

const User = new Schema({
  username: String,
  avatar: String,
  password: String,
  chatRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' }],
  friends:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { collection: 'Users',versionKey:false });
export default mongoose.model("User", User);
