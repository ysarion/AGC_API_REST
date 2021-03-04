import express from 'express';
import {
    getTris,
    getTri,
    postTri,
    getTypesTris,
    getTrisCriteres,
    getLieuxAVO,
    getMarket,
    postTypesTris,
    postLieuAVO, getLieuxAvoById, putLieuAVO, getTypeTriById, putTypesTris
} from '../controllers/trisController.js'

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
 * GET uri/tris/typesTris/:id
 * Récupérer un type de tri par son id
 */
router.get('/typesTris/:id', getTypeTriById);

/**
 * GET uri/tris/typesTris/AVO/Lieux
 * Récupérer la liste de tout les tris
 */
router.get('/typesTris/AVO/Lieux', getLieuxAVO);

/**
 * GET uri/tris/typesTris/AVO/Lieux/:id
 * Récupérer un avo par id
 */
router.get('/typesTris/AVO/Lieux/:id', getLieuxAvoById);

/**
 * GET uri/tris/criteres
 * Récupérer la liste de tout les tris
 */
router.get('/criteres', getTrisCriteres);

/**
 * GET uri/tris/market
 * Consulter un tri
 */
router.get('/market', getMarket);

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

/**
 * POST uri/tris/typesTris
 * Enregistrer un nouveau type de tris
 */
router.post('/typesTris', postTypesTris);

/**
 * PUT uri/tris/typesTris
 * Enregistrer un nouveau type de tris
 */
router.put('/typesTris', putTypesTris);

/**
 * POST uri/tris/typesTris/AVO/Lieux
 * Enregistrer un nouveau lieux pour les AVO
 */
router.post('/typesTris/AVO/Lieux', postLieuAVO);

/**
 * PUT uri/tris/typesTris/AVO/Lieux
 * Update un lieux pour les AVO
 */
router.put('/typesTris/AVO/Lieux', putLieuAVO);

export default router;


