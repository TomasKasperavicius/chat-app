import express, { Request, Response } from "express";
import User from "../Schemas/User";
import argon2 from "argon2";
import { UserInfo } from "../interfaces";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { avatar, username, password, email }: UserInfo = req.body;
    const user = User.findOne({username:username, email:email})
    if(!user)
      {
      const hashedPassword = await argon2.hash(password);
      const newUser = new User({
        avatar,
        username,
        password: hashedPassword,
        email,
      });
      await newUser.save();
      res.status(200).json(user);
    }
    else{
      res.status(409).json({error:"User already exists."})
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password }: UserInfo = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(403).json({ error: "Wrong email." });
    }
    if (!(await argon2.verify(user.password as string, password))) {
      return res.status(403).json({ error: "Wrong password." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
