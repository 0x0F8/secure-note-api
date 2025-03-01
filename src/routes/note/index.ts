import { Router } from "express";
import createNote, { createNoteSchema } from "./create";
import { zod } from "../../middleware/zod";
import unlockNote, { unlockNoteSchema } from "./unlock";

const router = Router()

router.post('/create', zod(createNoteSchema), createNote)
router.get('/unlock/:id', zod(unlockNoteSchema), unlockNote)

export default router