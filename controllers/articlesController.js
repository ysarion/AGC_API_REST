import sql from "mssql";
import {config} from "../Database/config.js";

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

export const getCodesArticlesByModele = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let param = parseInt(req.params['idModele'])
            let result = await sql.query('select articleId,codeArticle from Articles where fk_model = '+param)
            res.status(200).send(result.recordset);
        }catch (err){
            console.log(err);
            res.status(400).send('erreur : '+err);
        }
    })()
}

export const getArticleByCode = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let param = parseInt(req.params['code'])
            let result = await sql.query('select * from Articles left JOIN Modeles on fk_model = modeleId where codeArticle = '+param)
            res.status(200).send(result.recordset);
        }catch (err){
            console.log(err);
            res.status(400).send('erreur : '+err);
        }
    })()
}
