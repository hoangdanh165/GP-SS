import express from "express";
import {
  sendUpdates,
  newAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", sendUpdates);
router.post("/new", newAppointment);

export default router;
