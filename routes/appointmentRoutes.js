import express from "express";
import { sendUpdates } from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", sendUpdates);

export default router;
