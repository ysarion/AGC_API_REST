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
            if (result.recordset[0] === undefined) res.status(400).send("Aucun tri en base de donnée")
            else res.status(200).send(result.recordset);
        } catch (err) {
            console.log(err);
            res.status(400).send('erreur : ' + err);
        }
    })()
}

/**
 * function use to get all type of tris
 * @param req
 * @param res
 */
export const getTypesTris = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from TypesTris')
            res.status(200).send(result.recordset);
        } catch (err) {
            console.log(err);
            res.status(400).send('erreur : ' + err);
        }
    })()
}
export const getTypeTriById = (req, res) => {
    let typeTriId = req.params['id'];
    sql.connect(config).then(pool => {
        pool.request()
            .input('typeTriId', sql.Int, typeTriId)
            .query('SELECT typeTriId,typeTriNom FROM TypesTris WHERE typeTriId=@typeTriId')
            .then(result => {
                return res.status(200).send(result.recordset[0])
            }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}
/**
 * function use to get all avo's location
 * @param req
 * @param res
 */
export const getLieuxAVO = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from LieuxAVO')
            res.status(200).send(result.recordset);
        } catch (err) {
            console.log(err);
            res.status(400).send('erreur : ' + err);
        }
    })()
}
export const getLieuxAvoById = (req, res) => {
    let lieuAvoId = req.params['id']
    sql.connect(config).then(pool => {
        pool.request()
            .input('lieuAvoId', sql.Int, lieuAvoId)
            .query('SELECT lieuAvoId,nomLieu,fk_typeTri FROM LieuxAVO where lieuAvoId=@lieuAvoId')
            .then(result => {
                return res.status(200).send(result.recordset[0])
            }).catch(error => {
                return res.status(400).send(error)
            }
        )
    }).catch(error => {
            return res.status(400).send(error)
        }
    )
}
/**
 * function use to get all market
 * @param req
 * @param res
 */
export const getMarket = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Market')
            res.status(200).send(result.recordset);
        } catch (err) {
            console.log(err);
            res.status(400).send('erreur : ' + err);
        }
    })()
}

/**
 * function use to get all critere that a tri use
 * @param req
 * @param res
 */
export const getTrisCriteres = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Criteres where FK_TypeCriteres = 8')
            if (result.recordset[0] === undefined) res.status(400).send("Aucun tri en base de donnée")
            else res.status(200).send(result.recordset);
        } catch (err) {
            console.log(err);
            res.status(400).send('erreur : ' + err);
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
            let result = await sql.query('select * from Tris where triId = ' + param)
            let userId = result.recordset[0].fk_user;
            let User = await sql.query('select * from Users where idUser =' + userId);
            let articleId = result.recordset[0].fk_article;
            let article = await sql.query('select * from Articles LEFT JOIN Modeles ON Articles.fk_model = Modeles.modeleId where articleId =' + articleId);
            let typeTriId = result.recordset[0].fk_typeTri;
            let typeTri = await sql.query('select * from TypesTris where typeTriId =' + typeTriId);
            let marketId = result.recordset[0].fk_market;
            let market = await sql.query('select * from Market where marketId =' + marketId);
            let avoId = result.recordset[0].fk_LieuAVO;
            let avo = await sql.query('select * from LieuxAVO where lieuAvoId =' + avoId);
            let arrayToSend = {
                triId: result.recordset[0].triId,
                numGallia: result.recordset[0].numGallia,
                numOS: result.recordset[0].numOS,
                nbPieces: result.recordset[0].nbPieces,
                commentaireGeneral: result.recordset[0].commentaireGeneral,
                dateDebut: result.recordset[0].dateDebut,
                dateFin: result.recordset[0].dateFin,
                user: User.recordset[0],
                article: article.recordset[0],
                typeTri: typeTri.recordset[0],
                market: market.recordset[0],
                avo: avo.recordset[0],
            };
            if (result.recordset[0] === undefined) res.status(400).send("Tri with the given id is not in database")
            else {
                let SearchForCrit = await sql.query('select * from Tris_Criteres LEFT JOIN Criteres ON Tris_Criteres.FK_critereId = Criteres.critereId where FK_triId=' + param)
                arrayToSend['criteres'] = SearchForCrit.recordset
                res.status(200).send(arrayToSend)
            }
        } catch (err) {
            res.status(400).send('erreur : ' + err);
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
        fk_market: joi.number().integer().required(),
        fk_LieuAVO: joi.number().integer().allow(null).required(),
        numGallia: joi.number().integer().required(),
        numOS: joi.number().integer().required(),
        nbPieces: joi.number().integer().required(),
        commentaire: joi.string().optional().allow(null),
        dateDeb: joi.date().required(),
        dateFin: joi.date().required(),
        criteres: joi.array().items(criteresTri).required()
    })
    const schemaValidation = triObjectSchema.validate(req.body);
    if (schemaValidation.error) {
        return res.status(400).send("error : " + schemaValidation.error.details[0].message)
    }
    sql.connect(config).then(pool => {
        pool.request().input('fk_user', sql.Int, parseInt(req.body.fk_user))
            .input('fk_typeTris', sql.Int, parseInt(req.body.fk_typeTris))
            .input('fk_LieuAVO', sql.Int, parseInt(req.body.fk_LieuAVO))
            .input('fk_market', sql.Int, parseInt(req.body.fk_market))
            .input('fk_article', sql.Int, parseInt(req.body.fk_articles))
            .input('numGallia', sql.Int, parseInt(req.body.numGallia))
            .input('nbPieces', sql.Int, parseInt(req.body.nbPieces))
            .input('numOS', sql.Int, parseInt(req.body.numOS))
            .input('commentaire', sql.VarChar(100), req.body.commentaire)
            .input('dateDeb', sql.DateTime, req.body.dateDeb)
            .input('dateFin', sql.DateTime, req.body.dateFin)
            .output("id", sql.Int)
            .query('INSERT INTO Tris (' +
                'numGallia,' +
                'nbPieces,' +
                'numOS,' +
                'commentaireGeneral,' +
                'dateDebut,' +
                'dateFin,' +
                'fk_typeTri,' +
                'fk_LieuAVO,' +
                'fk_market,' +
                'fk_user,' +
                'fk_article) ' +
                'values (' +
                '@numGallia,' +
                '@nbPieces,' +
                '@numOS,' +
                '@commentaire,' +
                '@dateDeb,' +
                '@dateFin,' +
                '@fk_typeTris,' +
                '@fk_LieuAVO,' +
                '@fk_market,' +
                '@fk_user,' +
                '@fk_article); SELECT SCOPE_IDENTITY() AS id;').then(result => {
            let triId = result.recordset[0].id
            sql.connect(config).then(pool2 => {
                for (let i = 0; i < req.body.criteres.length; i++) {
                    pool2.request().input('FK_triId', sql.Int, parseInt(triId))
                        .input('FK_critereId', sql.Int, parseInt(req.body.criteres[i].FK_critereId))
                        .input('valueCritere', sql.VarChar, req.body.criteres[i].valueCritere)
                        .query('INSERT INTO Tris_Criteres (FK_triId,FK_critereId,valueCritere) VALUES (@FK_triId,@FK_critereId,@valueCritere)')
                }
            }).catch(error => {
                res.status(400).send('Error when inserting tri criteres: ' + error)
            });
            res.status(200).send("the tri was sucessfully enter.")
        })
    }).catch(error => {
        res.status(400).send("Insert tri Error : " + error);
    })

}

/**
 * Function use to insert a new type of tri
 * @param req
 * @param res
 * @returns {this}
 */
export const postTypesTris = (req, res) => {
    let typeTry = joi.object({
        typeTriNom: joi.string().min(3).max(60).required(),
        typeTriId: joi.number().integer().allow(null)
    })
    let requestValidation = typeTry.validate(req.body);
    if (requestValidation.error) {
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    (async function () {
        try {
            let pool = await sql.connect(config)
            const request = pool.request();
            request
                .input('typeTriNom', sql.VarChar(80), req.body.typeTriNom)
                .query('INSERT INTO TypesTris (typeTriNom) values (@typeTriNom);')
            return res.status(200).send("TypeTriNom was successfully register")
        } catch (e) {
            return res.status(500).send("erreur : " + e);
        }
    })();
}
export const putTypesTris = (req, res) => {
    let typeTry = joi.object({
        typeTriNom: joi.string().min(3).max(60).required(),
        typeTriId: joi.number().integer().required()
    })
    let requestValidation = typeTry.validate(req.body);
    if (requestValidation.error) {
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    sql.connect(config).then(pool => {
        pool.request()
            .input('typeTriId', sql.Int, req.body.typeTriId)
            .input('typeTriNom', sql.VarChar, req.body.typeTriNom)
            .query('UPDATE TypesTris SET typeTriNom=@typeTriNom WHERE typeTriId=@typeTriId;')
            .then(result => {
                return res.status(200).send(result.rowsAffected)
            }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}
export const deleteTypeTri = (req, res) => {
    let typeTriId = req.body.id
    sql.connect(config).then(pool => {
        pool.request()
            .input('typeTriId', sql.Int, typeTriId)
            .input('obsolete', sql.Bit, req.body.obsolete)
            .query('UPDATE TypesTris SET obsolete=@obsolete WHERE typeTriId=@typeTriId;')
            .then(result => {
                return res.status(200).send(result.rowsAffected)
            }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}

/**
 * function use to insert a new place of AVO
 * @param req
 * @param res
 * @returns {this}
 */
export const postLieuAVO = (req, res) => {
    let lieuAVO = joi.object({
        nomLieu: joi.string().min(3).max(30).required(),
        lieuAvoId: joi.number().integer().allow(null),
        fk_typeTri_AVO: joi.number().integer()
    })
    let requestValidation = lieuAVO.validate(req.body)
    if (requestValidation.error) {
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    (async function () {
        try {
            let pool = await sql.connect(config)
            const request = pool.request();
            request
                .input('nomLieu', sql.VarChar(80), req.body.nomLieu)
                .query('INSERT INTO LieuxAVO (nomLieu,fk_typeTri) values (@nomLieu,2);')
            return res.status(200).send("The new \"nomLieu\" was successfully register")
        } catch (e) {
            return res.status(500).send("erreur : " + e);
        }
    })();
}

/**
 * function use to update an AVO
 * @param req
 * @param res
 * @returns {this}
 */
export const putLieuAVO = (req, res) => {
    let lieuAVO = joi.object({
        nomLieu: joi.string().min(3).max(30).required(),
        lieuAvoId: joi.number().integer().required(),
        fk_typeTri: joi.number().integer().allow(null)
    })
    let requestValidation = lieuAVO.validate(req.body)
    if (requestValidation.error) {
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    sql.connect(config).then(pool => {
        pool.request()
            .input('nomLieu', sql.VarChar(80), req.body.nomLieu)
            .input('lieuAvoId', sql.Int, req.body.lieuAvoId)
            .query('UPDATE LieuxAVO SET nomLieu=@nomLieu WHERE lieuAvoId=@lieuAvoId;')
            .then(result => {
                return res.status(200).send(result.rowsAffected)
            }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}
export const deleteAVO = (req, res) => {
    let lieuAvoId = req.body.id
    sql.connect(config).then(pool => {
        pool.request()
            .input('lieuAvoId', sql.Int, lieuAvoId)
            .input('obsolete', sql.Bit, req.body.obsolete)
            .query('UPDATE LieuxAVO SET obsolete=@obsolete WHERE lieuAvoId=@lieuAvoId;')
            .then(result => {
                return res.status(200).send(result.rowsAffected)
            }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}
