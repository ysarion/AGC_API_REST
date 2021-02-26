import express from 'express';
import {
    getCrashQualites,
    getCrashQualite,
    getAnalysesCrash,
    getZones,
    getLignes,
    getLignesByZones,
    getMachines,
    getMachinesByLignes,
    postCrashQualite, postAnalyseCrash
} from '../controllers/crashQualiteController.js';

const router = express.Router();

/**
 * GET uri/crashQualites
 * Récupérer la liste de tout les crash qualités
 */
router.get('/', getCrashQualites);

/**
 * GET uri/crashQualites/analyseCrash
 * Récupérer la liste de toutes les analyses de crash qualités
 */
router.get('/analysesCrash', getAnalysesCrash);

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
 * POST uri/crashQualite
 * Enregistrer un nouveau crash qualité
 */
router.post('/', postCrashQualite);

/**
 * POST uri/crashQualites/analyseCrash
 * Enregistrer une analyse d'un crash qualité
 */
router.post('/analyseCrash', postAnalyseCrash);

export default router;


