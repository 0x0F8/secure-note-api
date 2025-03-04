import { Request, Response } from "express";
import { z } from "zod";
import ShortLinkController from "../../controller/ShortLinkController";

export const createShortLinkSchema = {
  params: z.object({
    path: z.string().min(2).max(256),
  }),
};

export default async function createShortLink(req: Request, res: Response) {
  const db = res.locals.db;
  const { path } = req.params;
  const shortId = await new ShortLinkController(db).createShortLink(path);
  if (!shortId) {
    res.json({ success: true, data: null });
    return;
  }
  res.json({ success: true, data: shortId });
}
