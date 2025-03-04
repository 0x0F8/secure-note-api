import { Request, Response } from "express";
import { z } from "zod";
import ShortLinkController from "../../controller/ShortLinkController";

export const getShortLinkSchema = {
  params: z.object({
    id: z.string().length(10),
  }),
};

export default async function getShortLink(req: Request, res: Response) {
  const db = res.locals.db;
  const { id } = req.params;
  const link = await new ShortLinkController(db).getShortLink(id);
  if (!link) {
    res.json({ success: true, data: null });
    return;
  }
  res.json({ success: true, data: link });
}
