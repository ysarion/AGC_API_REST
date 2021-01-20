import express from 'express';
import {getCrashQualites, getCrashQualite, postCrashQualite} from '../controllers/crashQualiteController.js'

const router = express.Router();

/**
 * GET uri/crashQualites
 * Récupérer la liste de tout les crash qualités
 */
router.get('/', getCrashQualites);

/**
 * GET uri/audit/:id
 * Consulter un crash qualité
 */
router.get('/:id', getCrashQualite);

/**
 * POST uri/audit
 * Enregistrer un nouveau crash qualité
 */
router.post('/', postCrashQualite);

export default router;


