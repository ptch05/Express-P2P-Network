import type { Request, Response } from "express";
import { lookupUser } from "../lookupUser";
import { addNode, getNodeByUser, getNodes } from "../servers";
import { v4 as uuidv4 } from "uuid";
import { appendEntryToJson } from "../appendEntryToJson";
import path from "path";

const seedIds = new Set();

export async function lookup(req: Request, res: Response) {
  try {
    const { user } = req.query as { user: string };
    if (!user) {
      return res.status(400).json({ error: "Missing user parameter" });
    }

    appendEntryToJson(path.join(process.cwd(), "./trace.json"), {
      user: process.env.USER_NAME,
    });

    const requestId = req.get("x-request-id") || uuidv4();

    if (seedIds.has(requestId)) {
      return res.status(404).json({ error: "user not found" });
    }

    seedIds.add(requestId);
    const serverByUser = getNodeByUser(user);

    if (!serverByUser) {
      let foundUser;

      for (let server of getNodes()) {
        try {
          foundUser = await lookupUser(user, server.uri, requestId);
          if (foundUser) break;
        } catch (err) {
          console.error(`Error looking up user on ${server.uri}:`, err);
        }
      }

      if (foundUser) {
        console.log(`cached ${foundUser.user}`);
        addNode(foundUser);
        return res.json(foundUser);
      } else {
        return res.status(404).json({ error: "user not found" });
      }
    }

    res.json(serverByUser);
  } catch (err) {
    console.error("Lookup error:", err);
    res.status(500).json({ error: "Failed to lookup user" });
  }
}