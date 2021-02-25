import express from 'express';
import {
    getCrashQualites,
    getCrashQualite,
    getZones,
    getLignes,
    getLignesByZones,
    getMachines,
    getMachinesByLignes,
    postCrashQualite
} from '../controllers/crashQualiteController.js';

const router = express.Router();

/**
 * GET uri/crashQualites
 * Récupérer la liste de tout les crash qualités
 */
router.get('/', getCrashQualites);

/**
 * GET uri/crashQualites/zones
 * Avoir la liste des zones
 */
router.get('/zones', getZones);

/**
 * GET uri/crashQualites/zones/lignes
 * Avoir la liste des lignes
 */
router.get('/zones/lignes', getLignes);

/**
 * GET uri/crashQualites/zones/:id/lignes
 * Avoir la liste des lignes en fonction des zones
 */
router.get('/zones/:id/lignes', getLignesByZones);

/**
 * GET uri/crashQualites/zones/lignes/machines
 * Avoir la liste des machines
 */
router.get('/zones/lignes/machines', getMachines);

/**
 * GET uri/crashQualites/zones/lignes/:id/machines
 * Avoir la liste des machines
 */
router.get('/zones/lignes/:id/machines', getMachinesByLignes);

/**
 * GET uri/crashQualites/:id
 * Consulter un crash qualité
 */
router.get('/:id', getCrashQualite);

/**
 * POST uri/audit
 * Enregistrer un nouveau crash qualité
 */
router.post('/', postCrashQualite);

export default router;


