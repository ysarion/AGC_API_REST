import sql from "mssql";
import {config} from "../Database/config.js";

const tris = [
    {
        id: 1,
        fk_user: 1,
        fk_articles: 1,
        fk_typeTris: 1,
        fk_market: 1,
        numGallia: 14524455,
        numOS: 888723,
        numContainer: 150551,
        nbPieces: 316,
        commentaire: null,
        dateDeb: "2016-12-21 8:00:00.000",
        dateFin: "2016-12-21 16:00:00.000"
    },
    {
        id: 2,
        fk_user: 2,
        fk_articles: 1,
        fk_typeTris: 3,
        fk_market: 1,
        numGallia: 5422445,
        numOS: 64121,
        numContainer: 887126,
        nbPieces: 135,
        commentaire: null,
        dateDeb: "2016-12-21 8:00:00.000",
        dateFin: "2016-12-21 16:00:00.000"
    }
]

export const getTris = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Tris')
            if(result.recordset[0] === undefined) res.status(400).send("Aucun tri en base de donnée")
            else res.status(200).send(result.recordset);
        }catch (err){
            console.log(err);
            res.status(400).send('erreur : '+err);
        }
    })()
}
export const getTypesTris =(req,res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from TypesTris')
            res.status(200).send(result.recordset);
        }catch (err){
            console.log(err);
            res.status(400).send('erreur : '+err);
        }
    })()
}

export const getTrisCriteres = (req,res) =>{
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Criteres where FK_TypeCriteres = 8')
            if(result.recordset[0] === undefined) res.status(400).send("Aucun tri en base de donnée")
            else res.status(200).send(result.recordset);
        }catch (err){
            console.log(err);
            res.status(400).send('erreur : '+err);
        }
    })()
}

export const getTri = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let param = parseInt(req.params['id'])
            let result = await sql.query('select * from Tris where triId = '+param)
            if(result.recordset[0] === undefined) res.status(400).send("Tri with the given id is not in database")
            else {
                let SearchForCrit = await sql.query('select * from Tris_Criteres where FK_triId = '+param)
                let arrayToSend =  result.recordset[0];
                arrayToSend['criteres'] = SearchForCrit.recordset
                console.log(arrayToSend);
                res.status(200).send(arrayToSend)
            }
        }catch (err){
            console.log(err);
            res.status(400).send('erreur : '+err);
        }
    })()
}

export const postTri = (req, res) => {
    //@todo retrieve data from db
    tris.push(req.body);
    res.send("ok");
}
