import express from 'express';
import {
    getArticles,
    getArticlesModeles,
    getCodesArticles,
    getCodesArticlesByModele,
    getArticleByCode,
    postModele,
    postArticle,
    getModeleById, putModele, putArticle
} from '../controllers/articlesController.js'
const router = express.Router();

/**
    GET uri/articles
    Recupérer la liste des articles
 **/
router.get('/', getArticles);

/**
    GET uri/articles/modeles
    Recupérer la liste des modèles de voiture des articles
 **/
router.get('/modeles', getArticlesModeles);

/**
    GET uri/articles/modeles/:id
    Recupérer la liste des modèles de voiture des articles
 **/
router.get('/modeles/:id', getModeleById);

/**
    GET uri/articles/codesArticle
    Recupérer la liste des codes articles
 **/
router.get('/codesArticles', getCodesArticles);

/**
    GET uri/articles/codesArticle/modele/:idModele
    Recupérer la liste des codes articles par modele
 **/
router.get('/codesArticles/modele/:idModele', getCodesArticlesByModele);

/**
 * GET uri/articles/:code
 * Recupérer un article en utilisant le code article
 **/
router.get('/:code', getArticleByCode)

/**
 * POST uri/articles/modeles
 * route use to insert a modele in database
 */
router.post('/modeles',postModele)

/**
 * PUT uri/articles/modeles
 * route use to update a modele in database
 */
router.put('/modeles',putModele)

/**
 * POST uri/articles
 * route use to insert an article in database
 */
router.post('/',postArticle)

/**
 * PUT uri/articles
 * route use to insert an article in database
 */
router.put('/',putArticle)

export default router;


