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
 * function use to get all equipe that a user can have
 * @param req
 * @param res
 */
export const getEquipes = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Equipes')
            return res.status(200).send(result.recordset);
        } catch (e) {
            console.log(e);
            return res.status(400).send('erreur : ' + e);
        }
    })()

}

/**
 * function use to get all roles that a user can have
 * @param req
 * @param res
 */
export const getRoles = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Roles')
            return res.status(200).send(result.recordset);
        } catch (e) {
            console.log(e);
            return res.status(400).send('erreur : ' + e);
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
            let result = await sql.query('select * from Users where BE = ' + param)
            if(result.recordset[0] === []) return res.status(204).send('L\'utilisateur recherché n\'existe pas en db');
            return res.status(200).send(result.recordset[0]);
        } catch (err) {
            console.log(err);
            return res.status(400).send('L\'utilisateur recherché n\'existe pas en db');
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
        return res.status(400).send(userValidation.error.details[0].message)
    }
    (async function () {
        try {
            let pool = await sql.connect(config)
            const request = pool.request();
            request
                .input('nom', sql.VarChar, req.body.nom)
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
                    '@FK_equipe)');
            return res.status(200).send("The user succesfully register")
        } catch (e) {
            return res.status(500).send("erreur : " + e);
        }
    })();
}
export const postEquipe = (req, res) => {
    let equipe = Joi.object({
        equipe: Joi.string().min(1).required()
    })
    let requestValidation = equipe.validate(req.body)
    if(requestValidation.error){
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    (async function () {
        try {
            let pool = await sql.connect(config)
            const request = pool.request();
            request
                .input('equipe', sql.VarChar, req.body.equipe)
                .query('INSERT INTO Equipes (equipe) values (@equipe)');
            return res.status(200).send("The new \"equipe\" was succesfully register")
        } catch (e) {
            return res.status(500).send("erreur : " + e);
        }
    })();
}
//@todo post Role
//@todo PUT METHOD for USER
