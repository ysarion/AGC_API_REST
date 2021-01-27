import sql from "mssql";
import {config} from "../Database/config.js";

const articlesController = [
    {
        idArticle: 1,
        codeArticles: 650187,
        modele: 1,
        numPlan: 4522214,
        descriptionSAP: "PB X TATATA BLALABALA"
    },{
        idArticle: 2,
        codeArticles: 650188,
        modele: 1,
        numPlan: 4522215,
        descriptionSAP: "PB X TATATA BLALABALA"
    },
    {
        idArticle: 3,
        codeArticles: 75016,
        modele: 2,
        numPlan: 5429453,
        descriptionSAP: "PB X TATATA BLALABALA"
    }
]
export const getArticles = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Articles ')
            res.send(result.recordset);
        }catch (err){
            console.log(err);
            res.send('erreur');
        }
    })()
}

export const getArticlesModeles = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Modeles')
            res.send(result.recordset);
        }catch (err){
            console.log(err);
            res.send('erreur');
        }
    })()
}

export const getCodesArticles = (req, res) => {
    //@todo retrieve data from db
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select codeArticle from Articles')
            res.send(result.recordset);
        }catch (err){
            console.log(err);
            res.send('erreur');
        }
    })()
}

export const getCodesArticlesByModele = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let param = parseInt(req.params['idModele'])
            let result = await sql.query('select codeArticle from Articles where fk_model = '+param)
            res.send(result.recordset);
        }catch (err){
            console.log(err);
            res.send('erreur');
        }
    })()
}

export const getArticleByCode = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let param = parseInt(req.params['code'])
            let result = await sql.query('select * from Articles where codeArticle = '+param)
            res.send(result.recordset);
        }catch (err){
            console.log(err);
            res.send('erreur');
        }
    })()
}
