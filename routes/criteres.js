import express from 'express';
import {
    getCriteres,
    getAllCritereProcess,
    getAllCriteresByProcess,
    getAllTypesCriteres,
    postTypesCriteres,
    postProcess,
    postCriteres
} from "../controllers/criteresController.js";

const router = express.Router();

/**
 GET uri/criteres
 Donne la liste de tous les critères existants
 **/
router.get('/', getCriteres);

/**
 GET uri/criteres/process
 Donne la liste de tous les process qu'un critère peut avoir
 **/
router.get('/process', getAllCritereProcess);

/**
 GET uri/criteres/process/{idProcess}
 Donne la liste de tous les critères pour un Process
 **/
router.get('/process/:idProcess', getAllCriteresByProcess);

/**
 GET uri/criteres/typeCriteres
 Donne la liste de tous les types de critere qu'un critère peut avoir
 **/
router.get('/typeCriteres', getAllTypesCriteres);

/**
 POST uri/criteres/typeCriteres
 Insert un nouveau type de criteres en database
 **/
router.post('/typeCriteres', postTypesCriteres);

/**
 POST uri/criteres/process
 Insert un nouveau process en database
 **/
router.post('/process', postProcess);

/**
 POST uri/criteres
 Insert un nouveau process en database
 **/
router.post('/', postCriteres);
export default router;
