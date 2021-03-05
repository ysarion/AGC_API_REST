import express from 'express';
import {
    getAudits,
    getAudit,
    getObjectifAnnuel,
    postAudit,
    postObjectifAnnuel,
    getAllObjectifAnnuel, deleteObjectif
} from '../controllers/auditController.js'

const router = express.Router();

/**
 * GET uri/audit/objectif
 * Consulter un l'objectif annuel fixé
 */
router.get('/objectif', getObjectifAnnuel);

/**
 * GET uri/audit/objectif/all
 * Consulter tous les objectifs
 */
router.get('/objectif/all', getAllObjectifAnnuel);

/**
 * GET uri/audit
 * Récupérer la liste de tout les audits
 */
router.get('/', getAudits);

/**
 * GET uri/audit/:id
 * Consulter un audit
 */
router.get('/:id', getAudit);


/**
 * POST uri/audit
 * Enregistrer un nouvel audit
 */
router.post('/', postAudit);

/**
 * POST uri/audits/objectif
 * Enregistrer un nouvel objectif
 */
router.post('/objectif', postObjectifAnnuel);

/**
 * DELETE uri/audits/objectif
 * Delete un objectif
 */
router.delete('/objectif', deleteObjectif);

export default router;


