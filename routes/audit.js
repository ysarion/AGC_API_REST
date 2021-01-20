import express from 'express';
import {getUsers,getUser,postUser} from '../controllers/users.js'
const router = express.Router();

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

export default router;


