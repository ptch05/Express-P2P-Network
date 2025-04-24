import type { Request, Response, RequestHandler } from "express";

export const message: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { from, message } = req.body;
    if (!from || !message) {
      res.status(400).json({ error: "Missing from or message" });
      return;
    }

    console.log(`${from}: ${message}`);
    res.json({ message: "success" });
    
  } catch (err) {
    console.error("Message error:", err);
    res.status(500).json({ error: "Failed to process message" });
  }
};