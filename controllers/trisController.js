import sql from "mssql";
import {config} from "../Database/config.js";
import joi from "joi";

/**
 * Function use to get all tris
 * @param req
 * @param res
 */
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

/**
 * function use to get all type of tris
 * @param req
 * @param res
 */
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

/**
 * function use to get all critere that a tri use
 * @param req
 * @param res
 */
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

/**
 * function use to get a tri by id in database
 * @param req
 * @param res
 */
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
                res.status(200).send(arrayToSend)
            }
        }catch (err){
            console.log(err);
            res.status(400).send('erreur : '+err);
        }
    })()
}

/**
 * function use to insert a tri in database
 * @param req
 * @param res
 */
export const postTri = (req, res) => {
    // Schema du post :
    let criteresTri = joi.object({
        FK_critereId: joi.number().integer().required(),
        valueCritere: joi.string().max(50).required()
    })
    let triObjectSchema = joi.object({
        fk_user: joi.number().integer().required(),
        fk_articles: joi.number().integer().required(),
        fk_typeTris: joi.number().integer().required(),
        numGallia: joi.number().integer().required(),
        numOS: joi.number().integer().required(),
        nbPieces: joi.number().integer().required(),
        commentaire: joi.string().optional().allow(null),
        dateDeb: joi.date().required(),
        dateFin: joi.date(),
        criteres: joi.array().items(criteresTri).required()
    })
    const schemaValidation = triObjectSchema.validate(req.body);
    if (schemaValidation.error) {
        res.status(400).send("error : "+schemaValidation.error.details[0].message)
        return
    }
    // Si le schéma correspond, on peut faire l'insert :
    (async function () {
        try {
            let pool = await sql.connect(config)
            const request = pool.request();
            request
                .input('fk_user', sql.Int, parseInt(req.body.fk_user))
                .input('fk_typeTris', sql.Int, parseInt(req.body.fk_typeTris))
                .input('fk_market', sql.Int, parseInt(req.body.fk_typeTris))
                .input('fk_article', sql.Int, parseInt(req.body.fk_articles))
                .input('numGallia', sql.Int, parseInt(req.body.numGallia))
                .input('nbPieces', sql.Int, parseInt(req.body.nbPieces))
                .input('numOS', sql.Int, parseInt(req.body.numOS))
                .input('commentaire', sql.VarChar(100), req.body.commentaire)
                .input('dateDeb', sql.DateTime, req.body.dateDeb)
                .query('INSERT INTO Tris (' +
                    'numGallia,' +
                    'nbPieces,' +
                    'numOS,' +
                    'commentaireGeneral,' +
                    'dateDebut,' +
                    'dateFin,' +
                    'fk_typeTri,' +
                    'fk_market,' +
                    'fk_user,' +
                    'fk_article) ' +
                    'values (' +
                    '@numGallia,' +
                    '@nbPieces,' +
                    '@numOS,' +
                    '@commentaire,' +
                    '@dateDeb,' +
                    'GETDATE(),' +
                    '@fk_typeTris,' +
                    '@fk_market,' +
                    '@fk_user,' +
                    '@fk_article)')
        } catch (e) {
            res.status(500).send("erreur : "+e);
        }
    })();
    /*
        ENREGISTREMENT DES CRITERES LIES AU TRI
        Pour avoir le dernier enregistrement on doit recupérer l'id du tri créé :
     */
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('SELECT TOP 1 triId FROM Tris ORDER BY triId DESC');
            //console.log("L'id du tri inseré est de : "+result.recordset[0].auditId)
            const triId = result.recordset[0].triId;
            //on boucle l'insert de critères
            for (let i = 0; i< req.body.criteres.length;i++){
                let pool = await sql.connect(config)
                const request = pool.request();
                request.input('FK_triId',sql.Int, parseInt(triId))
                    .input('FK_critereId',sql.Int, parseInt(req.body.criteres[i].FK_critereId))
                    .input('valueCritere',sql.VarChar,req.body.criteres[i].valueCritere)
                    .query('INSERT INTO Tris_Criteres (FK_triId,FK_critereId,valueCritere) VALUES (@FK_triId,@FK_critereId,@valueCritere)')
            }
            res.status(200).send('insert OK')
        } catch (err) {
            res.status(400).send('Error : '+err)
        }
    })()
}
