import sql from "mssql";
import {config} from "../Database/config.js";

/**
 * function use to get all articles
 * @param req
 * @param res
 */
export const getArticles = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Articles ')
            res.status(200).send(result.recordset);
        }catch (err){
            console.log(err);
            res.status(400).send('erreur : '+err);
        }
    })()
}

/**
 * function use to get the list of modele that an article can have
 * @param req
 * @param res
 */
export const getArticlesModeles = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Modeles')
            res.status(200).send(result.recordset);
        }catch (err){
            console.log(err);
            res.status(400).send('erreur : '+err);
        }
    })()
}

/**
 * function use to get the list of all codeArticles
 * @param req
 * @param res
 */
export const getCodesArticles = (req, res) => {
    //@todo retrieve data from db
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select codeArticle from Articles')
            res.status(200).send(result.recordset);
        }catch (err){
            console.log(err);
            res.status(400).send('erreur : '+err);
        }
    })()
}

/**
 * function use to get the list of ALL codes Articles By modele
 * @param req
 * @param res
 */
export const getCodesArticlesByModele = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let param = parseInt(req.params['idModele'])
            console.log(param);
            let result = await sql.query('select articleId,codeArticle from Articles where fk_model = '+param)
            console.log(result);
            res.status(200).send(result.recordset);
        }catch (err){
            console.log(err);
            res.status(400).send('erreur : '+err);
        }
    })()
}

/**
 * Function use to get an article by his code Article
 * @param req
 * @param res
 */
export const getArticleByCode = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let param = parseInt(req.params['code'])
            let result = await sql.query('select * from Articles left JOIN Modeles on fk_model = modeleId where codeArticle = '+param)
            res.status(200).send(result.recordset[0]);
        }catch (err){
            console.log(err);
            res.status(400).send('erreur : '+err);
        }
    })()
}

//@todo POST & PUT METHODE FOR ARTICLE / MODELE
