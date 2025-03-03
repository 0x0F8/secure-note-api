import { Request, Response } from "express";
import { z } from "zod";
import MongoDb from "../../db/mongodb";
import DigitalOcean from "../../api/digitalOcean";
import { add, formatISO } from "date-fns";

export const unlockFileSchema = {
  params: z.object({
    id: z.string().length(64),
  }),
};

export default async function unlockFile(req: Request, res: Response) {
  const db = res.locals.db as MongoDb;
  const digitalOcean = res.locals.api.digitalOcean as DigitalOcean;
  const { id } = req.params;

  const result = await db.file.findOneAndUpdate(
    { _id: id },
    { $set: { used: true } }
  );
  if (!result) {
    res.json({ success: true, data: null });
  }

  const wasUsed = result.oneTime && result.used;
  if (wasUsed) {
    res.json({ success: true, data: null });
    return;
  }

  const link = await digitalOcean.generateBucketPresignedUrl(id);
  res.json({ success: true, data: link });

  if (result.oneTime) {
    if (result.async) {
      const deleteAfter = add(new Date(), { hours: 6 });
      await db.deleteFile.create({
        _id: id,
        deleteAfter: formatISO(deleteAfter),
      });
    } else {
      await db.file.deleteOne({
        _id: result._id,
      });
      await digitalOcean.deleteMultipleFromBucket({
        Delete: {
          Objects: [{ Key: id }],
        },
      });
    }
  }
}
