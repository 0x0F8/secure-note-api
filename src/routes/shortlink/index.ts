import { Router } from "express";
import { zod } from "../../middleware/zod";
import createShortLink, { createShortLinkSchema } from "./create";
import getShortLink, { getShortLinkSchema } from "./get";

const router = Router();

router.post("/:path", zod(createShortLinkSchema), createShortLink);
router.get("/:id", zod(getShortLinkSchema), getShortLink);

export default router;
