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
            return res.status(200).send(result.recordset);
        } catch (err) {
            console.log(err);
            return res.status(400).send('erreur : ' + err);
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
                let idUser = result.recordset[0].fk_user;
                let idArticle = result.recordset[0].fk_article;
                console.log(result.recordset[0]);
                let idObjectif = result.recordset[0].fk_objectifAnnuel;
                let SearchForUser = await sql.query('select * from Users where idUser = ' + idUser);
                let SearchForArticle = await sql.query('select * from Articles where articleId = ' + idArticle);
                let SearchForObjectif = await sql.query('select * from ObjectifsAnnuel where objectifId = ' + idObjectif);
                let SearchForCrit = await sql.query('select * from Audit_Criteres \n' +
                    'left join Criteres on Audit_Criteres.FK_critereId = Criteres.critereId \n' +
                    'where Audit_Criteres.FK_auditId =' + param)
                let jsonToSend = {
                    auditId: result.recordset[0].auditId,
                    four: result.recordset[0].four,
                    numContainer: result.recordset[0].numContainer,
                    totalVerre: result.recordset[0].totalVerres,
                    pourcentageResultat: result.recordset[0].pourcentageResultat,
                    rating: result.recordset[0].rating,
                    commentaireGeneral: result.recordset[0].commentaireGeneral,
                    action : result.recordset[0].action,
                    dateDeb : result.recordset[0].dateDeb,
                    dateFin: result.recordset[0].dateFin,
                    objectif: SearchForObjectif.recordset[0],
                    User: SearchForUser.recordset[0],
                    Article: SearchForArticle.recordset[0],
                    Criteres: SearchForCrit.recordset


                };
                return res.status(200).send(jsonToSend)
            }
        } catch (err) {
            return res.status(400).send('erreur : ' + err);
        }
    })()
}

/**
 * function use to get the current objectif of the year
 * @param req
 * @param res
 */
export const getObjectifAnnuel = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let param = parseInt(req.params['id'])
            let result = await sql.query('select * from ObjectifsAnnuel where actif = 1')
            return res.status(200).send(result.recordset[0])

        } catch (err) {
            return res.status(400).send('erreur : ' + err);
        }
    })()

}

/**
 * function use to ALL objectifs
 * @param req
 * @param res
 */
export const getAllObjectifAnnuel = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from ObjectifsAnnuel')
            return res.status(200).send(result.recordset)

        } catch (err) {
            return res.status(400).send('erreur : ' + err);
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
            return res.status(500).send("erreur : " + e);
        }
    })().then(

        /*
        ENREGISTREMENT DES CRITERES LIES A L AUDIT
        Pour avoir le dernier enregistrement on doit recupérer l'id de l'audit créé :
     */
        (async () => {
            try {
                await sql.connect(config)
                let result = await sql.query('SELECT TOP 1 auditId FROM Audits ORDER BY auditId DESC');
                console.log("L'id de l'audit inseré est de : " + result.recordset[0].auditId)
                const auditId = result.recordset[0].auditId;
                //on boucle l'insert de critères
                let pool = await sql.connect(config)
                for (let i = 0; i < req.body.criteres.length; i++) {
                    const request = pool.request();
                    request.input('FK_auditId', sql.Int, parseInt(auditId))
                        .input('FK_critereId', sql.Int, parseInt(req.body.criteres[i].FK_critereId))
                        .input('observation', sql.VarChar, req.body.criteres[i].observation)
                        .input('valueCritere', sql.VarChar, req.body.criteres[i].valueCritere)
                        .query('INSERT INTO Audit_Criteres (FK_auditId,FK_critereId,observation,valueCritere) VALUES (@FK_auditId,@FK_critereId,@observation,@valueCritere)')
                }
                return res.status(200).send('The audit was successfully register')
            } catch (err) {
                return res.status(400).send('Error : ' + err)
            }
        })()
    )
}

/**
 * function use to post a new objectif in database
 * @param req
 * @param res
 * @returns {this}
 */
export const postObjectifAnnuel = (req, res) => {
    let objectif = joi.object({
        objectifId: joi.number().integer().allow(null),
        objectif: joi.number().integer().required(),
        actif: joi.boolean().required()
    });
    let requestValidation = objectif.validate(req.body)
    if (requestValidation.error) {
        return res.status(400).send(" validation Error : " + requestValidation.error.details[0].message)
    }
    if (req.body.actif) {
        (async function () {
            try {
                let pool = await sql.connect(config)
                const request = pool.request();
                request
                    .query('Update ObjectifsAnnuel set actif=0 where actif=1');
                //return res.status(200).send("The new \"objectif\" was succesfully register")
            } catch (e) {
                return res.status(400).send("SQL erreur lors de l'update : " + e);
            }
        })().then()
        {
            (async function () {
                try {
                    let pool = await sql.connect(config)
                    const update = pool.request();
                    update
                        .input('objectif', sql.VarChar, req.body.objectif)
                        .input('actif', sql.Bit, req.body.actif)
                        .query('INSERT INTO ObjectifsAnnuel (objectif,actif) values (@objectif,@actif)');
                    return res.status(200).send("The new \"objectif\" was succesfully register")
                } catch (e) {
                    return res.status(400).send("SQL erreur insert new val : " + e);
                }
            })();

        }
    } else {
        (async function () {
            try {
                let pool = await sql.connect(config)
                const insert = pool.request();
                insert
                    .input('objectif', sql.VarChar, req.body.objectif)
                    .input('actif', sql.Bit, req.body.actif)
                    .query('INSERT INTO ObjectifsAnnuel (objectif,actif) values (@objectif,@actif)');
                return res.status(200).send("The new objectif was succesfully register")
            } catch (e) {
                return res.status(400).send("SQL erreur insert new val: " + e);
            }
        })();

    }
}
/*
@   todo Create update route & function
 */


