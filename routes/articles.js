import express from 'express';
import {getArticles, getArticlesModeles, getCodesArticles, getCodesArticlesByModele,getArticleByCode,postModele} from '../controllers/articlesController.js'
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
 GET uri/articles/:code
 Recupérer un article en utilisant le code article
 **/
router.get('/:code', getArticleByCode)

/**
 * POST uri/articles/modeles
 * route use to insert a modele in database
 */
router.post('/modeles',postModele)

export default router;


