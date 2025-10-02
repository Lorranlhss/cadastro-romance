import express from 'express';
import { criarLead } from '../controllers/leadController.js';

const router = express.Router();

router.post('/', criarLead);

export default router;