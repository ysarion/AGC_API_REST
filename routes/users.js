import express from 'express';
import {
    getUsers,
    getUser,
    postUser,
    postEquipe,
    getEquipes,
    getRoles,
    getEquipeById, putEquipe, getUserById, putUser, deleteEquipe, deleteUser
} from '../controllers/usersController.js'

const router = express.Router();

// GET uri/users
router.get('/', getUsers);

/**
 * function use to get all equipe possible
 * uri/users/equipes
 */
router.get('/equipes', getEquipes);

/**
 * function use to get an equipe by id
 * uri/users/equipe/:id
 */
router.get('/equipes/:id', getEquipeById);

/**
 * function use to get all role possible
 * uri/users/roles
 */
router.get('/roles', getRoles);

// GET uri/users/{id}
router.get('/:id', getUser);

// GET uri/users/{id}
router.get('/id/:id', getUserById);

//POST uris/users/
router.post('/', postUser);
/**
 * PUT uri/users
 * function use to update a user
 */
router.put('/', putUser);
/**
 * DELETE uri/users
 * function use to delete a user
 */
router.delete('/', deleteUser);

/**
 * POST uri/users/equipe
 * route use to post a new equipe
 **/
router.post('/equipe', postEquipe);

/**
 * PUT uri/users/equipe
 * route use to update an equipe
 **/
router.put('/equipe', putEquipe);

router.delete('/equipe', deleteEquipe);

export default router;


