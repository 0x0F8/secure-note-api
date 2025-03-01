import { Request, Response } from 'express'
import { z, } from 'zod';
import MongoDb from '../../db/mongodb';
import { ObjectId } from 'mongodb'

export const unlockNoteSchema = {
    params: z.object({
        id: z.string().length(24)
    })
}

export default async function unlockNote(req: Request, res: Response) {
    const db = res.locals.db as MongoDb;
    const { id } = req.params;

    const result = await db.note.findOneAndUpdate({ '_id': new ObjectId(id) }, { '$set': { used: true } })
    if (!result || result.used) {
        res.json({ success: true, data: null })
        return;
    }
    res.json({ success: true, data: result.data })
}