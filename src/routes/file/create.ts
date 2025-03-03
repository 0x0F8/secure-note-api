import { Request, Response } from "express";
import { z } from "zod";
import { sha256 } from "../../util/crypto";
import DigitalOcean from "../../api/digitalOcean";

export const createFileSchema = {
  body: z.object({
    data: z.string().min(1).max(1e8),
    oneTime: z.boolean().optional(),
  }),
};

export default async function createFile(req: Request, res: Response) {
  const db = res.locals.db;
  const digitalOcean = res.locals.api.digitalOcean as DigitalOcean;
  const { data, oneTime = true } = req.body;

  const id = await sha256(data);
  await digitalOcean.uploadToBucket({
    Key: id,
    Body: data,
    ACL: "private",
    Metadata: { test: "true" },
  });

  const result = await db.file.insertOne({
    _id: id,
    used: false,
    oneTime,
    async: false,
  });
  res.json({ success: true, data: result.insertedId });
}
