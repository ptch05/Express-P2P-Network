import type { Request, Response } from 'express';

export function lookup(req: Request, res: Response) {
    res.json({
        message: "success"
    })

}