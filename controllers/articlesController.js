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
            return res.status(200).send(result.recordset);
        } catch (err) {
            console.log(err);
            return res.status(400).send('erreur : ' + err);
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
            let result = await sql.query('select * from Modeles');
            return res.status(200).send(result.recordset);
        } catch (err) {
            console.log(err);
            return res.status(400).send('erreur : ' + err);
        }
    })()
}

/**
 * function use to get the list of modele that an article can have
 * @param req
 * @param res
 */
export const getModeleById = (req, res) => {
    let id = req.params['id']
    sql.connect(config).then(pool => {
        pool.request()
            .input('modeleId', sql.Int, parseInt(id))
            .query('SELECT * from Modeles where modeleId = @modeleId').then(result => {
            return res.status(200).send(result.recordset[0])
        });
    }).catch(error => {
        return res.status(400).send(error)
    })
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
            return res.status(200).send(result.recordset);
        } catch (err) {
            console.log(err);
            return res.status(400).send('erreur : ' + err);
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
            let result = await sql.query('select articleId,codeArticle from Articles where fk_model = ' + param)
            return res.status(200).send(result.recordset);
        } catch (err) {
            return res.status(400).send('erreur : ' + err);
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
            return res.status(200).send(result.recordset[0]);
        } catch (err) {
            console.log(err);
            return res.status(400).send('erreur : ' + err);
        }
    })()
}

/**
 * function use to register a new modele
 * @param req
 * @param res
 * @returns {this}
 */
export const postModele = (req, res) => {
    let modele = joi.object({
        modeleId: joi.number().integer().allow(null),
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
            return res.status(200).send(JSON.parse("The new modele was successfully register"))
        } catch (e) {
            return res.status(500).send({message: e});
        }
    })();
}

export const putModele = (req, res) => {
    let modele = joi.object({
        modeleId: joi.number().integer().required(),
        obsolete: joi.boolean(),
        modele: joi.string().min(3).max(60).required()
    })
    let requestValidation = modele.validate(req.body)
    if (requestValidation.error) {
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    sql.connect(config).then(pool => {
        pool.request()
            .input('modele', sql.VarChar, req.body.modele)
            .input('modeleId', sql.Int, req.body.modeleId)
            .query('UPDATE Modeles SET modele = @modele WHERE modeleId = @modeleId').then(result => {
            return res.status(200).send(result.recordset)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}
export const deleteModele = (req, res) => {
    let modeleId = req.body.id
    sql.connect(config).then(pool => {
        pool.request()
            .input('modeleId', sql.Int, modeleId)
            .input('obsolete', sql.Bit, req.body.obsolete)
            .query('UPDATE Modeles SET obsolete=@obsolete WHERE modeleId=@modeleId;')
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
 * function use to register a new article in database
 * @param req
 * @param res
 * @returns {this}
 */
export const postArticle = (req, res) => {
    let article = joi.object({
        articleId: joi.number().integer().allow(null),
        codeArticle: joi.number().integer().required(),
        fk_model: joi.number().integer().required(),
        descriptionSAP: joi.string().min(6).max(100).required(),
        partNumber: joi.string().min(3).max(80).required()
    })
    let requestValidation = article.validate(req.body)
    if (requestValidation.error) {
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
            return res.status(200).send({message: "L'article a bien été enregistré."})
        } catch (e) {
            return res.status(500).send({error: e});
        }
    })();
}

/**
 * function use to update an article in database
 * @param req
 * @param res
 * @returns {this}
 */
export const putArticle = (req, res) => {
    let article = joi.object({
        articleId: joi.number().integer().allow(null),
        codeArticle: joi.number().integer().required(),
        fk_model: joi.number().integer().required(),
        descriptionSAP: joi.string().min(6).max(100).required(),
        partNumber: joi.string().min(3).max(80).required()
    })
    let requestValidation = article.validate(req.body)
    if (requestValidation.error) {
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    sql.connect(config).then(pool => {
        pool.request()
            .input('articleId', sql.Int, parseInt(req.body.articleId))
            .input('codeArticle', sql.Int, parseInt(req.body.codeArticle))
            .input('fk_model', sql.Int, parseInt(req.body.fk_model))
            .input('descriptionSAP', sql.VarChar, req.body.descriptionSAP)
            .input('partNumber', sql.VarChar, req.body.partNumber)
            .query('UPDATE Articles SET codeArticle=@codeArticle,fk_model=@fk_model,descriptionSAP=@descriptionSAP,partNumber=@partNumber WHERE articleId=@articleId').then(result => {
            return res.status(200).send(result.rowsAffected)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}

export const deleteArticle = (req, res) => {
    let articleId = req.body.id
    sql.connect(config).then(pool => {
        pool.request()
            .input('articleId', sql.Int, articleId)
            .input('obsolete', sql.Bit, req.body.obsolete)
            .query('UPDATE Articles SET obsolete=@obsolete WHERE articleId=@articleId;')
            .then(result => {
                return res.status(200).send(result.rowsAffected)
            }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}
