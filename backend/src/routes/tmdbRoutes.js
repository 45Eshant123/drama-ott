import express from "express";
import { importSeries } from "../controllers/tmdbController.js";

const router = express.Router();

router.post("/import/series", importSeries);

export default router;
