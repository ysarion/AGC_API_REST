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
export const getAnalysesCrash = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('SELECT * FROM AnalyseCrash')
            return res.status(200).send(result.recordset);
        } catch (e) {
            return res.status(400).send('erreur' + e);
        }
    })()
}
export const getAnalyseCrash = (req, res) => {
    (async () => {
        try {
            let idCrash = req.params['id'];
            await sql.connect(config)
            let result = await sql.query('SELECT * FROM AnalyseCrash where fk_crashQualite =' + idCrash)

            let SearchForOriginCrash = await sql.query(
                "select OrigineCrash.fk_ligne,ligne,OrigineCrash.fk_machine,machine,OrigineCrash.fk_analyseCrash from OrigineCrash " +
                "left join Lignes on Lignes.ligneId = OrigineCrash.fk_ligne " +
                "left join Machines on Machines.machineId = OrigineCrash.fk_machine " +
                "where fk_analyseCrash = " + result.recordset[0].analyseCrashId
            );
            let jsonToSend = {
                analyseCrashId: result.recordset[0].analyseCrashId,
                decision: result.recordset[0].decision,
                piecesJointes: result.recordset[0].piecesJointes,
                fk_crashQualite: result.recordset[0].fk_crashQualite,
                origineCrash: {
                    ligneId: SearchForOriginCrash.recordset[0].fk_ligne,
                    ligne: SearchForOriginCrash.recordset[0].ligne,
                    machineId: SearchForOriginCrash.recordset[0].fk_machine,
                    machine: SearchForOriginCrash.recordset[0].machine,
                }
            }
            return res.status(200).send(jsonToSend);
        } catch (e) {
            return res.status(400).send('erreur' + e);
        }
    })()
}
export const getCrashQualite = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let idCrash = req.params['id'];
            let result = await sql.query('SELECT * FROM CrashQualite where crashQualiteId=' + idCrash)
            let idArticle = result.recordset[0].fk_article;
            let idUser = result.recordset[0].fk_user;
            let SearchForUser = await sql.query(
                "select * from Users where idUser = " + idUser
            );
            let SearchForArticle = await sql.query(
                "select * from Articles left join Modeles on Articles.fk_model = Modeles.modeleId where articleId = " +
                idArticle
            );
            let SearchForDetectionCrash = await sql.query(
                "select DetectionCrash.fk_ligne,ligne,DetectionCrash.fk_machine,machine,DetectionCrash.fk_crashQualite from DetectionCrash " +
                "left join Lignes on Lignes.ligneId = DetectionCrash.fk_ligne " +
                "left join Machines on Machines.machineId = DetectionCrash.fk_machine " +
                "where fk_crashQualite = " + idCrash
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
                detetionCrash: {
                    ligneId: SearchForDetectionCrash.recordset[0].fk_ligne,
                    ligne: SearchForDetectionCrash.recordset[0].ligne,
                    machineId: SearchForDetectionCrash.recordset[0].fk_machine,
                    machine: SearchForDetectionCrash.recordset[0].machine,
                }
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

export const getZoneById = (req, res) => {
    let zoneId = req.params['id'];
    sql.connect(config).then(pool => {
        pool.request()
            .input('zoneId', sql.Int, zoneId)
            .query('SELECT * FROM Zones where zoneId = @zoneId ').then(result => {
            return res.status(200).send(result.recordset[0])
        })
    }).catch(error => {
        return res.status(400).send('erreur: ' + error)
    })
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
export const getLigneById = (req, res) => {
    let ligneId = req.params['id'];
    sql.connect(config).then(pool => {
        pool.request()
            .input('ligneId', sql.Int, ligneId)
            .query('SELECT * FROM Lignes WHERE ligneId=@ligneId')
            .then(result => {
                return res.status(200).send(result.recordset[0])
            })
    }).catch(error => {
        return res.status(400).send(error)
    })
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

export const getMachineById = (req, res) => {
    let machineId = req.params['id'];
    sql.connect(config).then(pool => {
        pool.request()
            .input('machineId', sql.Int, machineId)
            .query('SELECT * from Machines WHERE machineId=@machineId').then(result => {
            return res.status(200).send(result.recordset[0])
        }).catch(error => {
            return res.status(400).send('error: ' + error)
        })
    }).catch(error => {
        return res.status(400).send('error: ' + error)
    })
}

export const getMachinesByLignes = (req, res) => {
    const jsonToSend = [];
    sql.connect(config).then(pool => {
        pool.request()
            .input('fk_ligne', sql.Int, parseInt(req.params['id']))
            .query('SELECT fk_machine FROM Lignes_Machines where fk_ligne = @fk_ligne').then(result => {
            if (result.recordset.length > 0) {
                for (let i = 0; i < result.recordset.length; i++) {
                    sql.connect(config).then(pool2 => {
                        pool2.request()
                            .query('select * from Machines where machineId = ' + result.recordset[i].fk_machine).then(machine => {
                            jsonToSend.push(machine.recordset[0])
                            if (i === result.recordset.length - 1) {
                                res.status(200).send(jsonToSend);
                            }
                        })
                    })
                }
            } else {
                res.status(400).send('Aucunes machines liées à la ligne ou ligne inexistante')
            }
        })
    }).catch(error => {
        res.status(400).send(error)
    })
}
export const getMachinesLignesRelation = (req, res) => {
    sql.connect(config).then(pool => {
        pool.request()
            .query('select * from Lignes_Machines').then(result => {
            return res.status(200).send(result.recordset)
        })
    }).catch(error => {
        return res.status(400).send('error : ' + error)
    })
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
                    res.status(400).send('Error when inserting detectionCrash: ' + error)
                });
                res.status(200).send("the crash qualite was sucessfully enter.")
            });
    }).catch(error => {
        res.status(400).send('Error when inserting the crash: ' + error)
    });
}

export const postAnalyseCrash = (req, res) => {
    let analyseCrash = Joi.object({
        fk_crashQualite: Joi.number().integer().required(),
        decision: Joi.string().allow(null).required(),
        piecesJointes: Joi.string().allow(null).required(),
        originCrash: {
            fk_ligne: Joi.number().integer().required(),
            fk_machine: Joi.number().integer().allow(null).required()
        }
    })

    const schemaValidation = analyseCrash.validate(req.body);
    if (schemaValidation.error) {
        return res.status(400).send("error : " + schemaValidation.error.details[0].message)
    }
    sql.connect(config).then(pool => {
        pool.request()
            .input('fk_crashQualite', sql.Int, parseInt(req.body.fk_crashQualite))
            .input('piecesJointes', sql.VarChar, req.body.piecesJointes)
            .input('decision', sql.VarChar, req.body.decision)
            .output("id", sql.Int)
            .query('INSERT INTO AnalyseCrash (fk_crashQualite,decision,piecesJointes)  ' +
                'values (@fk_crashQualite,@decision,@piecesJointes); SELECT SCOPE_IDENTITY() AS id;')
            .then(result => {
                let analyseId = result.recordset[0].id
                sql.connect(config).then(pool2 => {
                    pool2.request().input('fk_ligne', sql.Int, parseInt(req.body.originCrash.fk_ligne))
                        .input('fk_machine', sql.Int, parseInt(req.body.originCrash.fk_machine))
                        .input('fk_analyseCrash', sql.Int, parseInt(analyseId))
                        .query('INSERT INTO OrigineCrash (fk_ligne,fk_machine,fk_analyseCrash) values (@fk_ligne,@fk_machine,@fk_analyseCrash);')
                }).catch(error => {
                    res.status(400).send('Error when inserting origine crash: ' + error)
                });
                sql.connect(config).then(pool3 => {
                    pool3.request().input('crashQualiteId', sql.Int, parseInt(req.body.fk_crashQualite))
                        .query('UPDATE CrashQualite SET statut = 0 WHERE crashQualiteId = @crashQualiteId;')
                }).catch(error => {
                    res.status(400).send('Error when Updating the crash statut: ' + error)
                })
                res.status(200).send("the Analyse was sucessfully enter.")
            });
    }).catch(error => {
        res.status(400).send('Error when inserting the analyse: ' + error)
    });
}

export const postZones = (req, res) => {
    let zoneSchema = Joi.object({
        zoneId: Joi.number().integer().allow(null).required(),
        zone: Joi.string().required()
    })
    let requestValidation = zoneSchema.validate(req.body);
    if (requestValidation.error) {
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    sql.connect(config).then(pool => {
        pool.request()
            .input('zone', sql.VarChar, req.body.zone)
            .query('INSERT INTO Zones (zone) values (@zone);')
        return res.status(200).send('La nouvelle zone été enregistré')
    }).catch(error => {
        return res.status(400).send('Erreur lors de l\'enregistrement de la zone : ' + error)
    })
}
export const putZones = (req, res) => {
    let zoneSchema = Joi.object({
        zoneId: Joi.number().integer().allow(null).required(),
        zone: Joi.string().required()
    })
    let requestValidation = zoneSchema.validate(req.body);
    if (requestValidation.error) {
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    sql.connect(config).then(pool => {
        pool.request()
            .input('zone', sql.VarChar, req.body.zone)
            .input('zoneId', sql.Int, req.body.zoneId)
            .query('UPDATE Zones SET zone=@zone where zoneId=@zoneId')
        return res.status(200).send('La zone été update')
    }).catch(error => {
        return res.status(400).send('Erreur lors de l\'update de la zone : ' + error)
    })
}

export const postLignes = (req, res) => {
    let ligneSchema = Joi.object({
        ligneId: Joi.number().integer().allow(null).required(),
        fk_zone: Joi.number().integer().required(),
        ligne: Joi.string().required()
    })
    let requestValidation = ligneSchema.validate(req.body);
    if (requestValidation.error) {
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    sql.connect(config).then(pool => {
        pool.request()
            .input('ligne', sql.VarChar, req.body.ligne)
            .input('fk_zone', sql.Int, req.body.fk_zone)
            .query('INSERT INTO Lignes (ligne,fk_zone) values (@ligne,@fk_zone);')
        return res.status(200).send('La nouvelle ligne été enregistrée')
    }).catch(error => {
        return res.status(400).send('Erreur lors de l\'enregistrement de la nouvelle ligne : ' + error)
    })
}
export const putLigne = (req, res) => {
    let ligneSchema = Joi.object({
        ligneId: Joi.number().integer().required(),
        fk_zone: Joi.number().integer().required(),
        ligne: Joi.string().required()
    })
    let requestValidation = ligneSchema.validate(req.body);
    if (requestValidation.error) {
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    sql.connect(config).then(pool => {
        pool.request()
            .input('ligne', sql.VarChar, req.body.ligne)
            .input('ligneId', sql.Int, req.body.ligneId)
            .input('fk_zone', sql.Int, req.body.fk_zone)
            .query('UPDATE Lignes SET ligne=@ligne,fk_zone=@fk_zone WHERE ligneId=@ligneId;')
        return res.status(200).send('La ligne été update')
    }).catch(error => {
        return res.status(400).send('Erreur lors de l\'update de la ligne : ' + error)
    })
}

export const postMachines = (req, res) => {
    let machineSchema = Joi.object({
        machineId: Joi.number().integer().allow(null).required(),
        machine: Joi.string().required(),
        listLignes: Joi.array().items(Joi.number().integer()).required()
    })
    let requestValidation = machineSchema.validate(req.body);
    if (requestValidation.error) {
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    sql.connect(config).then(pool => {
        pool.request()
            .input('machine', sql.VarChar, req.body.machine)
            .output('id', sql.Int)
            .query('INSERT INTO Machines (machine) values (@machine);SELECT SCOPE_IDENTITY() AS id;').then(
            result => {
                let newMachineId = result.recordset[0].id
                sql.connect(config).then(pool2 => {
                    for (let i = 0; i < req.body.listLignes.length; i++) {
                        pool2.request()
                            .input('fk_machine', sql.Int, parseInt(newMachineId))
                            .input('fk_ligne', sql.Int, parseInt(req.body.listLignes[i]))
                            .query('INSERT INTO Lignes_Machines (fk_machine,fk_ligne) values (@fk_machine,@fk_ligne);')
                    }
                }).catch(error => {
                    res.status(400).send(error)
                })
            })
        return res.status(200).send('La nouvelle machine été enregistrée')
    }).catch(error => {
        return res.status(400).send('Erreur lors de l\'enregistrement de la nouvelle ligne : ' + error)
    })
}
export const putMachines = (req, res) => {
    let machineSchema = Joi.object({
        machineId: Joi.number().integer().required(),
        machine: Joi.string().required(),
        obsolete: Joi.boolean(),
        listLignes: Joi.array().items(Joi.number().integer()).required()
    })
    let requestValidation = machineSchema.validate(req.body);
    if (requestValidation.error) {
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    let machineId = req.body.machineId
    sql.connect(config).then(pool => {
        pool.request()
            .input('machine', sql.VarChar, req.body.machine)
            .input('machineId', sql.Int, machineId)
            .query('UPDATE Machines SET machine=@machine WHERE machineId=@machineId;').then(
            () => {
                sql.connect(config).then(pool2 => {
                    pool2.request()
                        .input('fk_machine', sql.Int, parseInt(machineId))
                        .query('DELETE FROM Lignes_Machines where fk_machine=@fk_machine').then(() => {
                            sql.connect(config).then(pool3 => {
                                for (let i = 0; i < req.body.listLignes.length; i++) {
                                    pool3.request()
                                        .input('fk_machine', sql.Int, parseInt(machineId))
                                        .input('fk_ligne', sql.Int, parseInt(req.body.listLignes[i]))
                                        .query('INSERT INTO Lignes_Machines (fk_machine,fk_ligne) values (@fk_machine,@fk_ligne);')
                                }
                            })
                        }
                    )
                }).catch(error => {
                    res.status(400).send(error)
                })
            })
        return res.status(200).send('La machine été update')
    }).catch(error => {
        return res.status(400).send('Erreur lors de l\'update de la machine : ' + error)
    })
}
