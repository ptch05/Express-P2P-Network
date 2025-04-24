import type { Request, Response } from 'express';
import { getNodeByUser, getNodes } from '../servers';
import { lookupUser } from '../lookupUser';

export function lookup(req: Request, res: Response) {
    const serverByUser = getNodeByUser(req.query.user as string);
    const { user } = req.query as { user: string };
    if (!serverByUser) {
        for (let server of getNodes()){
            try {
                lookupUser(server.uri, user)
            } catch (e) {
                console.error(`Failed to lookup user ${req.query.user} on seed server: ${e}`);
            }
        }
        res.status(404).send("User not found");
    } else {
        res.json(serverByUser);
    }
}