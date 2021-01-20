import express from 'express';
import {getUsers,getUser,postUser} from '../controllers/users.js'
const router = express.Router();

// GET uri/users
router.get('/', getUsers);

// GET uri/users/{id}
router.get('/:id', getUser);

//POST uris/users/
router.post('/',postUser);
export default router;


