import sql from "mssql";
import {config} from "../Database/config.js";

export const getCriteres = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Criteres')
            res.send(result.recordset);
        } catch (e) {
            console.log(e);
        }
    })()
}

export const getAllCritereProcess = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Process')
            res.send(result.recordset);
        } catch (e) {
            console.log(e);
        }
    })()
}

export const getAllCriteresByProcess = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let param = parseInt(req.params['idProcess']);
            let result = await sql.query('SELECT * FROM Criteres LEFT JOIN Criteres_Process ON critereID = FK_critereID where FK_processID = ' + param)
            res.send(result.recordset);
        } catch (err) {
            console.log(err);
            res.send('L\'utilisateur recherché n\'existe pas en db');
        }
    })()
}

export const getAllTypesCriteres = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('SELECT * FROM typesCriteres')
            res.send(result.recordset);
        } catch (e) {
            console.log(e);
        }
    })()
}
