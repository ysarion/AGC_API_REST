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
    postCrashQualite,
    postAnalyseCrash,
    getAnalyseCrash,
    postZones,
    postLignes,
    postMachines,
    getMachinesLignesRelation,
    getLigneById, putLigne, getZoneById, putZones, getMachineById, putMachines
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
 * GET uri/crashQualites/analyseCrash/id
 * Récupérer l'analyse d'un crash qualités
 */
router.get('/analysesCrash/:id', getAnalyseCrash);

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
 * GET uri/crashQualites/zones/:id
 * Avoir une zone par son id
 */
router.get('/zone/:id', getZoneById);

/**
 * GET uri/crashQualites/zones/lignes/id
 * Avoir la liste des lignes
 */
router.get('/zones/ligne/:id', getLigneById);

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
 * GET uri/crashQualites/zones/lignes/machines/relations
 * Avoir la liste des machines
 */
router.get('/zones/lignes/machines/relations', getMachinesLignesRelation);

/**
 * GET uri/crashQualites/zones/lignes/machines
 * Avoir la liste des machines
 */
router.get('/zones/lignes/machine/:id', getMachineById);

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

/**
 * POST uri/crashQualites/zones
 * Enregistrer une nouvelle zone
 */
router.post('/zones', postZones);

/**
 * POST uri/crashQualites/zones
 * Update une zone
 */
router.put('/zones', putZones);

/**
 * POST uri/crashQualites/zones/lignes
 * Enregistrer une nouvelle ligne
 */
router.post('/zones/lignes', postLignes);

/**
 * PUT uri/crashQualites/zones/lignes
 * Update une ligne
 */
router.put('/zones/lignes', putLigne);

/**
 * POST uri/crashQualites/zones/lignes/machines
 * Enregistrer une nouvelle machine
 */
router.post('/zones/lignes/machines', postMachines);

/**
 * POST uri/crashQualites/zones/lignes/machines
 * Update une machine
 */
router.put('/zones/lignes/machines', putMachines);



export default router;


