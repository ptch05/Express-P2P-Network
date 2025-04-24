import type { Request, Response, RequestHandler } from "express";
import { lookupUser } from "../lookupUser";
import { v4 as uuidv4 } from "uuid";
import { sendMessage } from "../sendMessage";
import { getCurrentUri } from "../getCurrentUri";

export const send: RequestHandler = async (req: Request, res: Response) => {
  const { to, message } = req.body;
  try {
    const foundUser = await lookupUser(to, getCurrentUri(), uuidv4());
    await sendMessage(process.env.USER_NAME!, message, foundUser.uri);
    res.json({ message: "success" });
    return;
  } catch (err) {
    console.log(err);
    res.status(404).send("user not found");
    return;
  }
};