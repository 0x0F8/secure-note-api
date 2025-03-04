import { Request, Response } from "express";
import { z } from "zod";
import { sha256 } from "../../util/crypto";
import DigitalOcean from "../../api/DigitalOcean";
import ShortLinkController from "../../controller/ShortLinkController";
import { LINK_HOST } from "../../constants";

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
  const exists = await db.file.findOne({ _id: id });
  if (exists) {
    res.json({ success: false, data: null });
    return;
  }

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
  const shortLink = await new ShortLinkController(db).createShortLink(
    `/unlock/${result.insertedId}`
  );
  res.json({
    success: true,
    data: {
      id: result.insertedId,
      shortLink: `//${LINK_HOST}/${shortLink}`,
    },
  });
}
