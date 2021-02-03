import {config} from "../Database/config.js";
import sql from 'mssql'
import Joi from "joi";

/**
 * function use to get all users
 * @param req
 * @param res
 */
export const getUsers = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Users')
            res.status(200).send(result.recordset);
        } catch (e) {
            console.log(e);
            res.status(400).send('erreur : ' + e);
        }
    })()

}

/**
 * function use to get a user by his id
 * @param req
 * @param res
 */
export const getUser = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let param = parseInt(req.params.id);
            let result = await sql.query('select * from Users where idUser = ' + param)
            res.status(200).send(result.recordset[0]);
        } catch (err) {
            console.log(err);
            res.status(400).send('L\'utilisateur recherché n\'existe pas en db');
        }
    })()
}

/**
 * function use to insert a new user in database
 * @param req
 * @param res
 */
export const postUser = (req, res) => {
    let userSchema = Joi.object({
        mail: Joi.string().email().allow(null).required(),
        nom: Joi.string().required(),
        prenom: Joi.string().required(),
        BE: Joi.number().integer().required(),
        tracabilite: Joi.string().allow(null).required(),
        FK_role: Joi.number().integer().required(),
        FK_equipe: Joi.number().integer().required()
    })
    let userValidation = userSchema.validate(req.body);
    if (userValidation.error) {
        res.status(400).send(userValidation.error.details[0].message)
        return
    }
    (async function () {
        try {
            let pool = await sql.connect(config)
            const request = pool.request();
            request
                .input('nom', sql.VarChar,req.body.nom)
                .input('prenom', sql.VarChar, req.body.prenom)
                .input('BE', sql.Int, parseInt(req.body.BE))
                .input('mail', sql.VarChar, req.body.mail)
                .input('tracabilite', sql.VarChar, req.body.tracabilite)
                .input('FK_role', sql.Int, parseInt(req.body.FK_role))
                .input('FK_equipe', sql.Int, parseInt(req.body.FK_equipe))
                .query('INSERT INTO Users (' +
                    'nom,' +
                    'prenom,' +
                    'BE,' +
                    'mail,' +
                    'tracabilite,' +
                    'FK_role,' +
                    'FK_equipe)' +
                    'values (' +
                    '@nom,' +
                    '@prenom,' +
                    '@BE,' +
                    '@mail,' +
                    '@tracabilite,' +
                    '@FK_role,' +
                    '@FK_equipe)' );
            res.status(200).send("The user succesfully register")
        } catch (e) {
            res.status(500).send("erreur : " + e);
        }
    })();
}
