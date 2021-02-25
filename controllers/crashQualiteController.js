import sql from "mssql";
import {config} from "../Database/config.js";
import Joi from "joi";

export const getCrashQualites = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('SELECT * FROM CrashQualite')
            return res.status(200).send(result.recordset);
        } catch (e) {
            return res.status(400).send('erreur' + e);
        }
    })()
}
export const getCrashQualite = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('SELECT * FROM CrashQualite where crashQualiteId='+req.params['id'])
            let idArticle = result.recordset[0].fk_article;
            let idUser = result.recordset[0].fk_user;
            let SearchForUser = await sql.query(
                  "select * from Users where idUser = " + idUser
                );
            let SearchForArticle = await sql.query(
                "select * from Articles left join Modeles on Articles.fk_model = Modeles.modeleId where articleId = " +
                idArticle
            );                        
            const jsonToSend = {
              crashQualiteId: result.recordset[0].crashQualiteId,
              nbPieces: result.recordset[0].nbPieces,
              description: result.recordset[0].description,
              piecesJointes: result.recordset[0].piecesJointes,
              dateCrash: result.recordset[0].dateCrash,
              statut: result.recordset[0].status,
              user: SearchForUser.recordset[0],
              article: SearchForArticle.recordset[0],
            };
            return res.status(200).send(jsonToSend);
        } catch (e) {
            return res.status(400).send('erreur' + e);
        }
    })()
}

export const getZones = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('SELECT * FROM Zones where obsolete = 0')
            return res.status(200).send(result.recordset);
        } catch (e) {
            return res.status(400).send('erreur' + e);
        }
    })()
}

export const getLignes = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('SELECT * FROM Lignes where obsolete = 0')
            return res.status(200).send(result.recordset);
        } catch (e) {
            return res.status(400).send('erreur' + e);
        }
    })()
}

export const getLignesByZones = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('SELECT * FROM Lignes where obsolete = 0 and fk_zone =' + req.params['id'])
            return res.status(200).send(result.recordset);
        } catch (e) {
            return res.status(400).send('erreur' + e);
        }
    })()
}

export const getMachines = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('SELECT * FROM Machines where obsolete = 0')
            return res.status(200).send(result.recordset);
        } catch (e) {
            return res.status(400).send('erreur' + e);
        }
    })()
}
export const getMachinesByLignes = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('SELECT * FROM Machines where obsolete = 0 and fk_ligne =' + req.params['id'])
            return res.status(200).send(result.recordset);
        } catch (e) {
            return res.status(400).send('erreur' + e);
        }
    })()
}

export const postCrashQualite = (req, res) => {
    let crashQualite = Joi.object({
        nbPieces: Joi.number().integer().required(),
        description: Joi.string().allow(null).required(),
        piecesJointes: Joi.string().allow(null).required(),
        dateCrash: Joi.date().required(),
        fk_user: Joi.number().integer().required(),
        fk_article: Joi.number().integer().required(),
        detectionCrash: {
            fk_ligne: Joi.number().integer().required(),
            fk_machine: Joi.number().integer().allow(null).required()
        }
    })

    const schemaValidation = crashQualite.validate(req.body);
    if (schemaValidation.error) {
        return res.status(400).send("error : " + schemaValidation.error.details[0].message)
    }
    sql.connect(config).then(pool => {
        pool.request()
            .input('fk_user', sql.Int, parseInt(req.body.fk_user))
            .input('fk_article', sql.Int, parseInt(req.body.fk_article))
            .input('nbPieces', sql.Int, parseInt(req.body.nbPieces))
            .input('piecesJointes', sql.VarChar, req.body.piecesJointes)
            .input('description', sql.VarChar, req.body.description)
            .input('dateCrash', sql.DateTime, req.body.dateCrash)
            .output("id", sql.Int)
            .query('INSERT INTO CrashQualite (nbPieces,description,piecesJointes,dateCrash,statut,fk_user,fk_article)  ' +
                'values (@nbPieces,@description,@piecesJointes,@dateCrash,1,@fk_user,@fk_article); SELECT SCOPE_IDENTITY() AS id;')
            .then(result => {
                let crashId = result.recordset[0].id
                sql.connect(config).then(pool2 => {
                    pool2.request().input('fk_ligne', sql.Int, parseInt(req.body.detectionCrash.fk_ligne))
                        .input('fk_machine', sql.Int, parseInt(req.body.detectionCrash.fk_machine))
                        .input('fk_crashQualite', sql.Int, parseInt(crashId))
                        .query('INSERT INTO DetectionCrash (fk_ligne,fk_machine,fk_crashQualite) values (@fk_ligne,@fk_machine,@fk_crashQualite);')
                }).catch(error => {
                    res.status(400).send('Error when inserting detectionCrash: '+error)
                });
                res.status(200).send("the crash qualite was sucessfully enter.")
        });
    }).catch(error => {
        res.status(400).send('Error when inserting the crash: '+error)
    });
}
