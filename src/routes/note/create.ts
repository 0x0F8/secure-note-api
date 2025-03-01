import { Request, Response } from 'express'
import { z, } from 'zod';
import MongoDb from '../../db/mongodb';

export const createNoteSchema = {
    body: z.object({
        data: z.string().min(1).max(1e8)
    })
}

export default async function createNote(req: Request, res: Response) {
    const db = res.locals.db as MongoDb;
    const { data } = req.body;

    const result = await db.note.insertOne({ data, used: false })
    res.json({ success: true, data: result.insertedId })
}