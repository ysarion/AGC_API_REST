import express from 'express';
import {
    getCriteres,
    getAllCritereProcess,
    getAllCriteresByProcess,
    getAllTypesCriteres,
    getAllCritProcessRelation,
    postTypesCriteres,
    postProcess,
    postCriteres, getTypeCritById, putTypesCriteres, getProcessById, putProcess, getCritereById, putCritere
} from "../controllers/criteresController.js";

const router = express.Router();

/**
 GET uri/criteres
 Donne la liste de tous les critères existants
 **/
router.get('/', getCriteres);

/**
 GET uri/criteres
 Donne un critère par son id
 **/
router.get('/id/:id', getCritereById);

/**
 GET uri/criteres/process
 Donne la liste de tous les process qu'un critère peut avoir
 **/
router.get('/process', getAllCritereProcess);

/**
 GET uri/criteres/processById/:id
 Donne un process en fonction de son id
 **/
router.get('/processById/:id', getProcessById);

/**
 GET uri/criteres/process/relation
 Donne la liste de tous les relation entre un process et les critères
 **/
router.get('/process/relation', getAllCritProcessRelation);

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
 GET uri/criteres/typeCritere/:id
 Donne la liste de tous les types de critere qu'un critère peut avoir
 **/
router.get('/typeCritere/:id', getTypeCritById);

/**
 POST uri/criteres/typeCriteres
 Insert un nouveau type de criteres en database
 **/
router.post('/typeCriteres', postTypesCriteres);

/**
 POST uri/criteres/typeCriteres
 Insert un nouveau type de criteres en database
 **/
router.put('/typeCriteres', putTypesCriteres);

/**
 POST uri/criteres/process
 Insert un nouveau process en database
 **/
router.post('/process', postProcess);

/**
 POST uri/criteres/process
 Update un process en database
 **/
router.put('/process', putProcess);

/**
 POST uri/criteres
 Insert un nouveau process en database
 **/
router.post('/', postCriteres);

/**
 POST uri/criteres
 Update un process en database
 **/
router.put('/', putCritere);
export default router;
