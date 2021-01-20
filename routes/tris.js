import express from 'express';
import {getTris,getTri,postTri} from '../controllers/trisController.js'
const router = express.Router();

/**
 * GET uri/tris
 * Récupérer la liste de tout les tris
 */
router.get('/', getTris);
/**
 * GET uri/audit/:id
 * Consulter un tri
 */
router.get('/:id', getTri);

/**
 * POST uri/audit
 * Enregistrer un nouveau tri
 */
router.post('/', postTri);

export default router;


