import express, { Request, Response } from "express";
import ChatRoom from "../Schemas/ChatRoom";
import User from "../Schemas/User";
import { IChatRoom, Message } from "../interfaces";
import { Types } from "mongoose";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { owner, type, participants }: IChatRoom = req.body;
    const chatRoom = new ChatRoom({ owner, type, participants });
    await chatRoom.save();

    await User.findByIdAndUpdate(participants[0], {
      $push: { friends: participants[1], chatRooms: chatRoom._id },
    }).exec();
    await User.findByIdAndUpdate(participants[1], {
      $push: { friends: participants[0], chatRooms: chatRoom._id },
    }).exec();

    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.id).populate({
      path: 'messages.sender',
      select: 'username'
    })
      .exec();
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }
    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const chatRooms = await ChatRoom.find({
      participants: userId
    }).populate({
      path: 'messages.sender',
      select: 'username'
    })
      .exec();
    if (!chatRooms || chatRooms.length === 0) {
      return res.status(404).json({ message: "No chat rooms found for this user" });
    }
    res.status(200).json(chatRooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user chat rooms" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { participants, messages, owner, type }: IChatRoom = req.body;
    const chatRoom = await ChatRoom.findByIdAndUpdate(
      req.params.id,
      { $set: { participants, messages, owner, type } },
      { new: true }
    );

    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    if (participants && participants.length > 0) {
      const oldParticipants = chatRoom.participants;

      oldParticipants.forEach(async (oldParticipant: Types.ObjectId) => {
        if (!participants.includes(oldParticipant.toString())) {
          await User.findByIdAndUpdate(oldParticipant, {
            $pull: { chatRooms: chatRoom._id },
          }).exec();
        }
      });

      participants.forEach(async (participant: string) => {
        await User.findByIdAndUpdate(participant, {
          $addToSet: { chatRooms: chatRoom._id },
        }).exec();
      });
    }
    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.patch("/:id/messages", async (req: Request, res: Response) => {
  try {
    const { body, sender, date }: Message = req.body;

    const chatRoom = await ChatRoom.findByIdAndUpdate(
      req.params.id,
      { $push: { messages: { sender: sender, body: body, date: date } } },
      { new: true }
    );

    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: "Failed to append message to chat room" });
  }
});


router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const chatRoom = await ChatRoom.findByIdAndDelete(req.params.id);
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    await User.updateMany(
      { _id: { $in: chatRoom.participants } },
      { $pull: { chatRooms: chatRoom._id } }
    ).exec();

    res.status(200).json({ message: "Chat room deleted successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
