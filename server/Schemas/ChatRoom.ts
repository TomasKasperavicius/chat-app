import mongoose from "mongoose";
const { Schema } = mongoose;

const ChatRoom = new Schema({
  owner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  type: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ sender:String,body: String, date: Date , default: []}],
}, { collection: 'ChatRooms',versionKey:false });
export default mongoose.model("ChatRoom", ChatRoom);
