import express from 'express';
import {getTris,getTri,postTri,getTypesTris,getTrisCriteres, getLieuxAVO} from '../controllers/trisController.js'
const router = express.Router();

/**
 * GET uri/tris
 * Récupérer la liste de tout les tris
 */
router.get('/', getTris);

/**
 * GET uri/tris/typesTris
 * Récupérer la liste de tout les tris
 */
router.get('/typesTris', getTypesTris);

/**
 * GET uri/tris/typesTris/AVO/Lieux
 * Récupérer la liste de tout les tris
 */
router.get('/typesTris/AVO/Lieux', getLieuxAVO);

/**
 * GET uri/tris/criteres
 * Récupérer la liste de tout les tris
 */
router.get('/criteres', getTrisCriteres);

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


