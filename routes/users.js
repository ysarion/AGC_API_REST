import express from 'express';
import {getUsers,getUser,postUser,postEquipe} from '../controllers/usersController.js'
const router = express.Router();

// GET uri/users
router.get('/', getUsers);

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


