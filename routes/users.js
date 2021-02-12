import express from 'express';
import {getUsers,getUser,postUser,postEquipe,getEquipes, getRoles} from '../controllers/usersController.js'
const router = express.Router();

// GET uri/users
router.get('/', getUsers);

/**
 * function use to get all equipe possible
 * uri/users/equipes
 */
router.get('/equipes', getEquipes);

/**
 * function use to get all role possible
 * uri/users/roles
 */
router.get('/roles', getRoles);

// GET uri/users/{id}
router.get('/:id', getUser);

//POST uris/users/
router.post('/',postUser);

/**
 * POST uri/users/equipe
 * route use to post a new equipe
 **/
router.post('/equipe',postEquipe);
export default router;


