import sql from "mssql";
import {config} from "../Database/config.js";
import joi from "joi";

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
        } catch (err) {
            console.log(err);
            res.status(400).send('erreur : ' + err);
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
        } catch (err) {
            console.log(err);
            res.status(400).send('erreur : ' + err);
        }
    })()
}

/**
 * function use to get the list of all codeArticles
 * @param req
 * @param res
 */
export const getCodesArticles = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select codeArticle from Articles')
            res.status(200).send(result.recordset);
        } catch (err) {
            console.log(err);
            res.status(400).send('erreur : ' + err);
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
            let result = await sql.query('select articleId,codeArticle from Articles where fk_model = ' + param)
            console.log(result);
            res.status(200).send(result.recordset);
        } catch (err) {
            console.log(err);
            res.status(400).send('erreur : ' + err);
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
            let result = await sql.query('select * from Articles left JOIN Modeles on fk_model = modeleId where codeArticle = ' + param)
            res.status(200).send(result.recordset[0]);
        } catch (err) {
            console.log(err);
            res.status(400).send('erreur : ' + err);
        }
    })()
}

//@todo PUT METHODE FOR ARTICLE / MODELE

/**
 * function use to register a new modele
 * @param req
 * @param res
 * @returns {this}
 */
export const postModele = (req, res) => {
    let modele = joi.object({
        modele: joi.string().min(3).max(60).required()
    })
    let requestValidation = modele.validate(req.body)
    if (requestValidation.error) {
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    (async function () {
        try {
            let pool = await sql.connect(config)
            const request = pool.request();
            request
                .input('modele', sql.VarChar(80), req.body.modele)
                .query('INSERT INTO Modeles (modele) values (@modele);')
            return res.status(200).send("The new \"modele\" was successfully register")
        } catch (e) {
            return res.status(500).send("erreur : " + e);
        }
    })();
}

/**
 * function use to register a new article in database
 * @param req
 * @param res
 * @returns {this}
 */
export const postArticle = (req, res) => {
    let article = joi.object({
        codeArticle: joi.number().integer().required(),
        fk_model: joi.number().integer().required(),
        descriptionSAP: joi.string().min(6).max(100).required(),
        partNumber: joi.string().min(3).max(80).required()
    })
    let requestValidation = article.validate(req.body)
    if(requestValidation.error){
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    (async function () {
        try {
            let pool = await sql.connect(config)
            const request = pool.request();
            request
                .input('codeArticle', sql.Int, parseInt(req.body.codeArticle))
                .input('fk_model', sql.Int, parseInt(req.body.fk_model))
                .input('descriptionSAP', sql.VarChar, req.body.descriptionSAP)
                .input('partNumber', sql.VarChar, req.body.partNumber)
                .query('INSERT INTO Articles (codeArticle,fk_model,descriptionSAP,partNumber) values (@codeArticle,@fk_model,@descriptionSAP,@partNumber);')
            return res.status(200).send("The new \"article\" was successfully register")
        } catch (e) {
            return res.status(500).send("erreur : " + e);
        }
    })();
}
