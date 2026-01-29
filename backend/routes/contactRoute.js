import express from "express";
import { submitContactForm } from "../controllers/contactController.js";

const router = express.Router();

// POST route for contact form submission
router.post("/submit", submitContactForm);

export default router;
