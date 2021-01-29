import joi from 'joi'
import sql from 'mssql'
import {config} from "../Database/config.js";

const audits = [
    {
        id: 1,
        fk_user: 1,
        fk_articles: 1,
        four: "Four 1",
        numContainer: 150551,
        totalVerres: 124,
        resultPourcentage: 98,
        objectifAnnuel: 97,
        rating: "A",
        commentaireGeneral: null,
        dateDeb: "2016-12-21 8:00:00.000",
        dateFin: "2016-12-21 16:00:00.000"
    },
    {
        id: 2,
        fk_user: 1,
        fk_articles: 1,
        four: "Four 1",
        numContainer: 145254,
        totalVerres: 154,
        resultPourcentage: 97,
        objectifAnnuel: 97,
        rating: "B",
        commentaireGeneral: null,
        dateDeb: "2016-12-23 8:00:00.000",
        dateFin: "2016-12-23 16:00:00.000"
    }
]

export const getAudits = (req, res) => {
    //@todo retrieve data from db
    res.send(audits);
}

export const getAudit = (req, res) => {
    //@todo retrieve data from db
    for (let i = 0; i < audits.length; i++) {
        if (audits[i].id === parseInt(req.params['id'])) {
            res.send(audits[i]);
            return;
        }
    }
}

export const postAudit = (req, res) => {
    // Schema du post :
    let criteresAudit = joi.object({
        FK_critereId: joi.number().integer().required(),
        obeservation: joi.string().max(30).optional().allow(null),
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
        commentaireGeneral: joi.string().optional().allow(null),
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
                .input('dateDeb', sql.DateTime, req.body.dateDeb)
                .query('INSERT INTO Audits (four,numContainer,totalVerres,pourcentageResultat,rating,commentaireGeneral,action,dateDebut,dateFin,fk_objectifAnnuel,fk_user,' +
                    'fk_article) values (@four,@numContainer,@totalVerres,@resultPourcentage,@rating,@commentaireGeneral,null,@dateDeb,GETDATE(),@fk_objectifAnnuel,@fk_user,@fk_article)')
        } catch (e) {
            res.status(500).send("erreur : "+e);
        }
    })();
    // Pour avoir le dernier enregistrement on doit recupérer l'id de l'audit créé :
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('SELECT TOP 1 auditId FROM Audits ORDER BY auditId DESC');
            //console.log("L'id de l'audit inseré est de : "+result.recordset[0].auditId)
            const auditId = result.recordset[0].auditId;
            //on boucle l'insert de critères
            for (let i = 0; i< req.body.criteres.length;i++){
                let pool = await sql.connect(config)
                const request = pool.request();
                request.input('FK_auditId',sql.Int, parseInt(auditId))
                    .input('FK_critereId',sql.Int, parseInt(req.body.criteres[i].FK_critereId))
                    .input('observation',sql.VarChar,req.body.criteres[i].obeservation)
                    .input('valueCritere',sql.VarChar,req.body.criteres[i].valueCritere)
                    .query('INSERT INTO Audit_Criteres (FK_auditId,FK_critereId,observation,valueCritere) VALUES (@FK_auditId,@FK_critereId,@observation,@valueCritere)')
            }
            res.status(200).send('insert OK')
        } catch (err) {
            res.status(400).send('Error : '+err)
        }
    })()
}
