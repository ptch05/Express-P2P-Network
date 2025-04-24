import type { Request, Response, RequestHandler } from "express";
import { addNode } from "../servers";

export const register: RequestHandler = (req: Request, res: Response) => {
  try {
    const { user, uri } = req.body;
    if (!user || !uri) {
      res.status(400).json({ error: "Missing user or uri" });
      return;
    }

    addNode({ user, uri });
    res.json({ message: "success" });
    
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Failed to register node" });
  }
};