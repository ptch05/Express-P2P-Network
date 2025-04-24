import type { Request, Response, RequestHandler } from "express";
import { lookupUser } from "../lookupUser";
import { v4 as uuidv4 } from "uuid";
import { sendMessage } from "../sendMessage";
import { getCurrentUri } from "../getCurrentUri";

export const send: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) {
      res.status(400).json({ error: "Missing to or message" });
      return;
    }

    const foundUser = await lookupUser(to, getCurrentUri(), uuidv4());
    if (!foundUser) {
      res.status(404).json({ error: "Recipient not found" });
      return;
    }

    if (!process.env.USER_NAME) {
      res.status(500).json({ error: "Server configuration error" });
      return;
    }

    await sendMessage(process.env.USER_NAME, message, foundUser.uri);
    res.json({ message: "success" });
    
  } catch (err) {
    console.error("Send error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};