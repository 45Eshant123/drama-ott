import express from "express";
import { importSeries, addEpisodesFromLinks } from "../controllers/tmdbController.js";

const router = express.Router();

router.post("/import/series", importSeries);
router.post("/episodes/:id", addEpisodesFromLinks);

export default router;
