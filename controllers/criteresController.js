import sql from "mssql";
import {config} from "../Database/config.js";

export const getCriteres = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Criteres')
            res.status(200).send(result.recordset);
        } catch (e) {
            console.log(e);
            res.status(400).send('erreur : '+e);
        }
    })()
}

export const getAllCritereProcess = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Process')
            res.status(200).send(result.recordset);
        } catch (e) {
            res.status(400).send('erreur : '+e);
        }
    })()
}

export const getAllCriteresByProcess = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let param = parseInt(req.params['idProcess']);
            let result = await sql.query('SELECT * FROM Criteres LEFT JOIN Criteres_Process ON critereID = FK_critereID LEFT JOIN typesCriteres ON FK_TypeCriteres = typeCritereId where FK_processID =' + param)
            res.status(200).send(result.recordset);
        } catch (err) {
            res.status(400).send('erreur : '+err);
        }
    })()
}

export const getAllTypesCriteres = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('SELECT * FROM typesCriteres')
            res.status(200).send(result.recordset);
        } catch (e) {
            res.status(400).send('erreur' + e);
        }
    })()
}
