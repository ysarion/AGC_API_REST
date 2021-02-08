import joi from 'joi'
import sql from 'mssql'
import {config} from "../Database/config.js";

/**
 * Function use to get all audits
 * @param req
 * @param res
 */
export const getAudits = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Audits')
            res.status(200).send(result.recordset);
        } catch (err) {
            console.log(err);
            res.status(400).send('erreur : ' + err);
        }
    })()
}

/**
 * Function use to get 1 audit by id
 * @param req
 * @param res
 */
export const getAudit = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let param = parseInt(req.params['id'])
            let result = await sql.query('select * from Audits where auditId = ' + param)
            if (result.recordset[0] === undefined) res.status(400).send("Audit with the given id is not in database")
            else {
                let SearchForCrit = await sql.query('select * from Audit_Criteres where FK_auditId = ' + param)
                let arrayToSend = result.recordset[0];
                arrayToSend['criteres'] = SearchForCrit.recordset
                console.log(arrayToSend);
                res.status(200).send(arrayToSend)
            }
        } catch (err) {
            console.log(err);
            res.status(400).send('erreur : ' + err);
        }
    })()
}

/**
 * Function use to insert an audit in database
 * @param req
 * @param res
 */
export const postAudit = (req, res) => {
    // Schema du post :
    let criteresAudit = joi.object({
        FK_critereId: joi.number().integer().required(),
        observation: joi.string().max(30).optional().allow(null),
        valueCritere: joi.string().max(50).required()
    })
    let auditObjectSchema = joi.object({
        fk_user: joi.number().integer().required(),
        fk_articles: joi.number().integer().required(),
        four: joi.string().min(3).optional().allow(null),
        numContainer: joi.number().integer().required(),
        totalVerres: joi.number().integer().required(),
        resultPourcentage: joi.number().integer().required(),
        rating: joi.string().min(1).max(1).required(),
        commentaireGeneral: joi.string().allow(null).required(),
        action: joi.string().allow(null).required(),
        objectifAnnuel: joi.number().integer().required(),
        dateDeb: joi.date().required(),
        dateFin: joi.date(),
        criteres: joi.array().items(criteresAudit).required()
    })
    const result = auditObjectSchema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }
    //1ere partie : Enregistrement de l'audit en DB
    (async function () {
        try {
            let pool = await sql.connect(config)
            const request = pool.request();
            request
                .input('fk_user', sql.Int, parseInt(req.body.fk_user))
                .input('fk_objectifAnnuel', sql.Int, parseInt(req.body.objectifAnnuel))
                .input('fk_article', sql.Int, parseInt(req.body.fk_articles))
                .input('four', sql.VarChar(10), req.body.four)
                .input('numContainer', sql.Int, parseInt(req.body.numContainer))
                .input('totalVerres', sql.Int, parseInt(req.body.totalVerres))
                .input('resultPourcentage', sql.Int, parseInt(req.body.resultPourcentage))
                .input('rating', sql.VarChar(1), req.body.rating)
                .input('commentaireGeneral', sql.VarChar(100), req.body.commentaireGeneral)
                .input('action', sql.VarChar(100), req.body.action)
                .input('dateDeb', sql.DateTime, req.body.dateDeb)
                .query('INSERT INTO Audits (four,numContainer,totalVerres,pourcentageResultat,rating,commentaireGeneral,action,dateDebut,dateFin,fk_objectifAnnuel,fk_user,' +
                    'fk_article) values (@four,@numContainer,@totalVerres,@resultPourcentage,@rating,@commentaireGeneral,@action,@dateDeb,GETDATE(),@fk_objectifAnnuel,@fk_user,@fk_article)')
        } catch (e) {
            res.status(500).send("erreur : " + e);
        }
    })();
    /*
        ENREGISTREMENT DES CRITERES LIES A L AUDIT
        Pour avoir le dernier enregistrement on doit recupérer l'id de l'audit créé :
     */
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('SELECT TOP 1 auditId FROM Audits ORDER BY auditId DESC');
            //console.log("L'id de l'audit inseré est de : "+result.recordset[0].auditId)
            const auditId = result.recordset[0].auditId;
            //on boucle l'insert de critères
            for (let i = 0; i < req.body.criteres.length; i++) {
                let pool = await sql.connect(config)
                const request = pool.request();
                request.input('FK_auditId', sql.Int, parseInt(auditId))
                    .input('FK_critereId', sql.Int, parseInt(req.body.criteres[i].FK_critereId))
                    .input('observation', sql.VarChar, req.body.criteres[i].obeservation)
                    .input('valueCritere', sql.VarChar, req.body.criteres[i].valueCritere)
                    .query('INSERT INTO Audit_Criteres (FK_auditId,FK_critereId,observation,valueCritere) VALUES (@FK_auditId,@FK_critereId,@observation,@valueCritere)')
            }
            res.status(200).send('insert OK')
        } catch (err) {
            res.status(400).send('Error : ' + err)
        }
    })()
}

/*
@   todo Create update route & function
 */


