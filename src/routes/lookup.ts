import type { Request, Response } from 'express';
import { getNodeByUser } from '../servers';

export function lookup(req: Request, res: Response) {
    const serverByUser = getNodeByUser(req.query.user as string);
    if (!serverByUser) {
        res.status(404).send("User not found");
    } else {
        res.json(serverByUser);
    }
}