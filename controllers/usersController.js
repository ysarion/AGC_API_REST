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
export const getEquipeById = (req, res) => {
    let equipeId = req.params['id']
    sql.connect(config).then(pool => {
        pool.request()
            .input('equipeId', sql.Int, equipeId)
            .query('SELECT equipeId,equipe FROM Equipes WHERE equipeId=@equipeId;')
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
 * function use to get a user by his BE
 * @param req
 * @param res
 */
export const getUser = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let param = parseInt(req.params.id);
            let result = await sql.query('select * from Users where obsolete=0 and BE = ' + param)
            if (result.recordset[0] === []) return res.status(204).send('L\'utilisateur recherché n\'existe pas en db');
            return res.status(200).send(result.recordset[0]);
        } catch (err) {
            return res.status(400).send('L\'utilisateur recherché n\'existe pas en db');
        }
    })()
}
export const getUserById = (req, res) => {
    let userId = req.params['id'];
    sql.connect(config).then(pool => {
        pool.request()
            .input('idUser', sql.Int, userId)
            .query('SELECT idUser,mail,nom,prenom,BE,tracabilite,FK_role,FK_equipe FROM Users WHERE idUser=@idUser')
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
 * function use to insert a new user in database
 * @param req
 * @param res
 */
export const postUser = (req, res) => {
    let userSchema = Joi.object({
        idUser: Joi.number().integer().allow(null),
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
export const putUser = (req, res) => {
    let userSchema = Joi.object({
        idUser: Joi.number().integer().required(),
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
    sql.connect(config).then(pool => {
        pool.request()
            .input('idUser', sql.Int, req.body.idUser)
            .input('nom', sql.VarChar, req.body.nom)
            .input('prenom', sql.VarChar, req.body.prenom)
            .input('BE', sql.Int, parseInt(req.body.BE))
            .input('mail', sql.VarChar, req.body.mail)
            .input('tracabilite', sql.VarChar, req.body.tracabilite)
            .input('FK_role', sql.Int, parseInt(req.body.FK_role))
            .input('FK_equipe', sql.Int, parseInt(req.body.FK_equipe))
            .query('UPDATE Users SET ' +
                'nom=@nom, ' +
                'prenom=@prenom, ' +
                'BE=@BE, ' +
                'mail=@mail, ' +
                'tracabilite=@tracabilite, ' +
                'FK_role=@FK_role, ' +
                'FK_equipe=@FK_equipe ' +
                'WHERE idUser=@idUser ')
            .then(result => {
                return res.status(200).send(result.rowsAffected)
            }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}
export const postEquipe = (req, res) => {
    let equipe = Joi.object({
        equipe: Joi.string().min(1).required(),
        equipeId: Joi.number().integer().allow(null)
    })
    let requestValidation = equipe.validate(req.body)
    if (requestValidation.error) {
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
export const putEquipe = (req, res) => {
    let equipe = Joi.object({
        equipe: Joi.string().min(1).required(),
        equipeId: Joi.number().integer().required()
    })
    let requestValidation = equipe.validate(req.body)
    if (requestValidation.error) {
        return res.status(400).send(requestValidation.error.details[0].message)
    }
    sql.connect(config).then(pool => {
        pool.request()
            .input('equipeId', sql.Int, req.body.equipeId)
            .input('equipe', sql.VarChar, req.body.equipe)
            .query('UPDATE Equipes SET equipe=@equipe WHERE equipeId=@equipeId;')
            .then(result => {
                return res.status(200).send(result.rowsAffected)
            }).catch(error => {
            return res.status(400).send(error)
        })
    }).catch(error => {
        return res.status(400).send(error)
    })
}
