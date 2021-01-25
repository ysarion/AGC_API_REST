import express from 'express';
import {getTris,getTri,postTri} from '../controllers/trisController.js'
const router = express.Router();

/**
 * GET uri/tris
 * Récupérer la liste de tout les tris
 */
router.get('/', getTris);
/**
 * GET uri/tris/:id
 * Consulter un tri
 */
router.get('/:id', getTri);

/**
 * POST uri/tris
 * Enregistrer un nouveau tri
 */
router.post('/', postTri);

export default router;


