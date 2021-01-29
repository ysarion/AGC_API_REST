import {config} from "../Database/config.js";
import sql from 'mssql'
const usersController = [
    {id: 1, firstName: 'jeremy', lastName: 'Daix', BE: 117059, role: 'User', equipe: null, tracabilite: null},
    {id: 2, firstName: 'Pierre', lastName: 'Faidherbe', BE: 117060, role: 'User', equipe: null, tracabilite: null}
]

export const getUsers = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let result = await sql.query('select * from Users')
            res.status(200).send(result.recordset);
        }catch (e){
            console.log(e);
            res.status(400).send('erreur : '+ e);
        }
    })()

}

export const getUser = (req, res) => {
    (async () => {
        try {
            await sql.connect(config)
            let param = parseInt(req.params.id);
            let result = await sql.query('select * from Users where idUser = '+param)
            res.status(200).send(result.recordset[0]);
        }catch (err){
            console.log(err);
            res.status(400).send('L\'utilisateur recherché n\'existe pas en db');
        }
    })()
}

export const postUser = (req, res) => {
    //@todo post data in db
    const user = req.body;
    usersController.push(user);
    res.send('ok');
}
