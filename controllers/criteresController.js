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

//@todo PUT METHODE FOR CRITERES / TYPE CRITERE / Process
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
    (async function () {
        try {
            let pool = await sql.connect(config)
            const request = pool.request();
            request
                .input('nomCritere', sql.VarChar, req.body.nomCritere)
                .input('typeObservation', sql.VarChar, req.body.typeObservation)
                .input('infoDemerite', sql.VarChar, req.body.infoDemerite)
                .input('FK_typeCriteres', sql.VarChar, req.body.FK_TypeCriteres)
                .query('INSERT INTO Criteres (nomCritere,typeObservation,infoDemerite,FK_typeCriteres) values (@nomCritere,@typeObservation,@infoDemerite,@FK_TypeCriteres)');
        } catch (e) {
            return res.status(500).send("Insert du critère erreur : " + e);
        }
    })().then(
        // On doit lié le critère à un ou plusieurs process
        (async () => {
            try {
                await sql.connect(config)
                let result = await sql.query('SELECT TOP 1 critereId FROM Criteres ORDER BY critereId DESC');
                const critereId = result.recordset[0].critereId;
                //on boucle l'insert de critères
                for (let i = 0; i < req.body.listProcess.length; i++) {
                    let pool = await sql.connect(config)
                    const request = pool.request();
                    request.input('FK_critereId', sql.Int, parseInt(critereId))
                        .input('FK_processId', sql.Int, parseInt(req.body.listProcess[i]))
                        .query('INSERT INTO Criteres_Process (FK_critereId,FK_processId) VALUES (@FK_critereId,@FK_processId)')
                }
                return res.status(200).send('the new critere was successfully register')
            } catch (err) {
                return res.status(400).send('Inscription des process Error : ' + err)
            }
        })()
    )
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
