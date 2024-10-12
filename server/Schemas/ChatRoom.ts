import mongoose from "mongoose";
import User from "./User";
const { Schema } = mongoose;

const ChatRoom = new Schema({
  owner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  type: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },body: String, date: Date , default: []}],
}, { collection: 'ChatRooms',versionKey:false });
export default mongoose.model("ChatRoom", ChatRoom);
