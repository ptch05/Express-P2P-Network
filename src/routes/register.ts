import type { Request, Response } from 'express';
import { addNode } from '../servers';

export function register(req: Request, res: Response){
    const { user, uri } = req.body;
    addNode({ user, uri });
    res.status(200).json({ message: "Node registered successfully" });
}