import { Router } from "express";
import createFile, { createFileSchema } from "./create";
import { zod } from "../../middleware/zod";
import unlockFile, { unlockFileSchema } from "./unlock";

const router = Router();

router.post("/create", zod(createFileSchema), createFile);
router.get("/unlock/:id", zod(unlockFileSchema), unlockFile);

export default router;
