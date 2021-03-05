import sql from "mssql";
import Joi from "joi"
import {config} from "../Database/config.js";

export const getCriteres = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Criteres')
            return res.status(200).send(result.recordset);
        } catch (e) {
            console.log(e);
            return res.status(400).send('erreur : ' + e);
        }
    })()
}
export const getCritereById = (req, res) => {
    let critereId = req.params['id'];
    sql.connect(config).then(pool => {
        pool.request()
            .input('critereId', sql.Int, critereId)
            .query('SELECT critereId,nomCritere,typeObservation,infoDemerite,FK_TypeCriteres FROM Criteres WHERE critereId=@critereId;')
            .then(result => {
                return res.status(200).send(result.recordset[0])
            }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}
export const getAllCritereProcess = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Process')
            return res.status(200).send(result.recordset);
        } catch (e) {
            return res.status(400).send('erreur : ' + e);
        }
    })()
}
export const getProcessById = (req, res) => {
    let processId = req.params['id'];
    sql.connect(config).then(pool => {
        pool.request()
            .input('processId', sql.Int, processId)
            .query('SELECT processId,nomProcess FROM Process WHERE processId=@processId')
            .then(result => {
                return res.status(200).send(result.recordset[0])
            }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}
export const getAllCriteresByProcess = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let param = parseInt(req.params['idProcess']);
            let result = await sql.query('SELECT * FROM Criteres LEFT JOIN Criteres_Process ON critereID = FK_critereID LEFT JOIN typesCriteres ON FK_TypeCriteres = typeCritereId where FK_processID =' + param)
            return res.status(200).send(result.recordset);
        } catch (err) {
            return res.status(400).send('erreur : ' + err);
        }
    })()
}

export const getAllTypesCriteres = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('SELECT * FROM typesCriteres')
            return res.status(200).send(result.recordset);
        } catch (e) {
            return res.status(400).send('erreur' + e);
        }
    })()
}
export const getTypeCritById = (req, res) => {
    let typeCritereId = parseInt(req.params['id']);
    sql.connect(config).then(pool => {
        pool.request()
            .input('typeCritereId', sql.Int, typeCritereId)
            .query('SELECT typeCritereId, type FROM TypesCriteres WHERE typeCritereId=@typeCritereId')
            .then(result => {
                return res.status(200).send(result.recordset[0])
            }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}
export const getAllCritProcessRelation = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('SELECT * FROM Criteres_Process')
            return res.status(200).send(result.recordset);
        } catch (e) {
            return res.status(400).send('erreur' + e);
        }
    })()
}

export const postCriteres = (req, res) => {
    let critere = Joi.object({
        critereId: Joi.number().integer().allow(null),
        nomCritere: Joi.string().min(3).max(100).required(),
        typeObservation: Joi.string().allow(null).required(),
        infoDemerite: Joi.string().allow(null).required(),
        FK_TypeCriteres: Joi.number().integer().required(),
        listProcess: Joi.array().items(Joi.number().integer()).required()
    })
    const schemaValidation = critere.validate(req.body);
    if (schemaValidation.error) {
        return res.status(400).send("Critere validation error : " + schemaValidation.error.details[0].messages)
    }
    // Si le schéma correspond, on peut faire l'insert du critere :
    sql.connect(config).then(pool => {
        pool.request().input('nomCritere', sql.VarChar, req.body.nomCritere)
            .input('typeObservation', sql.VarChar, req.body.typeObservation)
            .input('infoDemerite', sql.VarChar, req.body.infoDemerite)
            .input('FK_typeCriteres', sql.VarChar, req.body.FK_TypeCriteres)
            .output('id', sql.Int)
            .query('INSERT INTO Criteres (nomCritere,typeObservation,infoDemerite,FK_typeCriteres) values (@nomCritere,@typeObservation,@infoDemerite,@FK_TypeCriteres);SELECT SCOPE_IDENTITY() AS id;')
            .then(result => {
                let critereId = result.recordset[0].id;
                for (let i = 0; i < req.body.listProcess.length; i++) {
                    sql.connect(config).then(pool2 => {
                        pool2.request()
                            .input('FK_critereId', sql.Int, parseInt(critereId))
                            .input('FK_processId', sql.Int, parseInt(req.body.listProcess[i]))
                            .query('INSERT INTO Criteres_Process (FK_critereId,FK_processId) VALUES (@FK_critereId,@FK_processId)')
                    })
                }
            }).then(() => {
            return res.status(200).send('the new critere was successfully register')
        }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}
export const putCritere = (req, res) => {
    let critere = Joi.object({
        critereId: Joi.number().integer().required(),
        nomCritere: Joi.string().min(3).max(100).required(),
        typeObservation: Joi.string().allow(null).required(),
        infoDemerite: Joi.string().allow(null).required(),
        FK_TypeCriteres: Joi.number().integer().required(),
        listProcess: Joi.array().items(Joi.number().integer()).required()
    })
    const schemaValidation = critere.validate(req.body);
    if (schemaValidation.error) {
        return res.status(400).send("Critere validation error : " + schemaValidation.error.details[0].messages)
    }
    // Si le schéma correspond, on peut faire l'insert du critere :
    let critereId = req.body.critereId
    sql.connect(config).then(pool => {
        pool.request().input('nomCritere', sql.VarChar, req.body.nomCritere)
            .input('typeObservation', sql.VarChar, req.body.typeObservation)
            .input('infoDemerite', sql.VarChar, req.body.infoDemerite)
            .input('FK_typeCriteres', sql.VarChar, req.body.FK_TypeCriteres)
            .input('critereId', sql.Int, critereId)
            .query('UPDATE Criteres SET nomCritere=@nomCritere,typeObservation=@typeObservation,infoDemerite=@infoDemerite,FK_typeCriteres=@FK_typeCriteres WHERE critereId=@critereId')
            .then(() => {
                sql.connect(config).then(pool2 => {
                    pool2.request()
                        .input('FK_critereId', sql.Int, critereId)
                        .query('DELETE FROM Criteres_Process WHERE FK_critereId=@FK_critereId')
                }).then(() => {
                    for (let i = 0; i < req.body.listProcess.length; i++) {
                        sql.connect(config).then(pool3 => {
                            pool3.request()
                                .input('FK_critereId', sql.Int, parseInt(critereId))
                                .input('FK_processId', sql.Int, parseInt(req.body.listProcess[i]))
                                .query('INSERT INTO Criteres_Process (FK_critereId,FK_processId) VALUES (@FK_critereId,@FK_processId)')
                        })
                    }
                }).catch(error => {
                    return res.status(400).send(error)
                })
            }).then(() => {
            return res.status(200).send('the critere was successfully update')
        }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}
export const deleteCritere = (req, res) => {
    let critereId = req.body.id
    sql.connect(config).then(pool => {
        pool.request()
            .input('critereId', sql.Int, critereId)
            .input('obsolete', sql.Bit, req.body.obsolete)
            .query('UPDATE Criteres SET obsolete=@obsolete WHERE critereId=@critereId;')
            .then(result => {
                return res.status(200).send(result.rowsAffected)
            }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}

export const postTypesCriteres = (req, res) => {
    let typeCriteres = Joi.object({
        type: Joi.string().min(3).required(),
        typeCritereId: Joi.number().integer().allow(null)
    })
    const schemaValidation = typeCriteres.validate(req.body);
    if (schemaValidation.error) {
        res.status(400).send("error : " + schemaValidation.error.details[0].message)
        return
    }
    // Si le schéma correspond, on peut faire l'insert :
    (async function () {
        try {
            let pool = await sql.connect(config)
            const request = pool.request();
            request
                .input('type', sql.VarChar, req.body.type)
                .query('INSERT INTO TypesCriteres (type) values (@type)');
            res.status(200).send('The new critere\'s type was register successfully')
        } catch (e) {
            res.status(500).send("erreur : " + e);
        }
    })();
}
export const putTypesCriteres = (req, res) => {
    let typeCriteres = Joi.object({
        type: Joi.string().min(3).required(),
        typeCritereId: Joi.number().integer().required()
    })
    const schemaValidation = typeCriteres.validate(req.body);
    if (schemaValidation.error) {
        return res.status(400).send("error : " + schemaValidation.error.details[0].message)
    }
    // Si le schéma correspond, on peut faire l'insert :
    sql.connect(config).then(pool => {
        pool.request()
            .input('typeCritereId', sql.Int, req.body.typeCritereId)
            .input('type', sql.VarChar, req.body.type)
            .query('UPDATE TypesCriteres SET type=@type WHERE typeCritereId=@typeCritereId;').then(result => {
            return res.status(200).send(result.rowsAffected);
        }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}

export const postProcess = (req, res) => {
    let process = Joi.object({
        nomProcess: Joi.string().min(3).max(40).required(),
        processId: Joi.number().integer().allow(null)
    })
    const schemaValidation = process.validate(req.body);
    if (schemaValidation.error) {
        res.status(400).send("error : " + schemaValidation.error.details[0].message)
        return
    }
    // Si le schéma correspond, on peut faire l'insert :
    (async function () {
        try {
            let pool = await sql.connect(config)
            const request = pool.request();
            request
                .input('nomProcess', sql.VarChar, req.body.nomProcess)
                .query('INSERT INTO Process (nomProcess) values (@nomProcess)');
            res.status(200).send('The new process was register successfully')
        } catch (e) {
            res.status(500).send("erreur : " + e);
        }
    })();
}
export const putProcess = (req, res) => {
    let process = Joi.object({
        nomProcess: Joi.string().min(3).max(40).required(),
        processId: Joi.number().integer().required()
    })
    const schemaValidation = process.validate(req.body);
    if (schemaValidation.error) {
        return res.status(400).send("error : " + schemaValidation.error.details[0].message)
    }
    sql.connect(config).then(pool => {
        pool.request()
            .input('processId', sql.Int, parseInt(req.body.processId))
            .input('nomProcess', sql.VarChar, req.body.nomProcess)
            .query('UPDATE Process SET nomProcess=@nomProcess WHERE processId=@processId')
            .then(result => {
                return res.status(200).send(result.rowsAffected)
            }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}
export const deleteProcess = (req, res) => {
    let processId = req.body.id
    sql.connect(config).then(pool => {
        pool.request()
            .input('processId', sql.Int, processId)
            .input('obsolete', sql.Bit, req.body.obsolete)
            .query('UPDATE Process SET obsolete=@obsolete WHERE processId=@processId;')
            .then(result => {
                return res.status(200).send(result.rowsAffected)
            }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}

