const criteres = [
    {id: 1, fk_typeCriteres: 1, nomCritere: "coup blanc", infoDemerite: "2mm -> 3 | 3mm -> 5 | 5mm -> 20"},
    {id: 2, fk_typeCriteres: 1, nomCritere: "griffes", infoDemerite: "2mm -> 3 | 3mm -> 5 | 5mm -> 20"}
]
const criteresProcess = [
    {id: 1, nomProcess: "HUD"},
    {id: 2, nomProcess: "Multiprint"},
    {id: 3, nomProcess: "Pre-process"},
    {id: 4, nomProcess: "Post-process"}
]
const criteres_process_joinTable = [
    {fk_criteres: 1, fk_process: 1},
    {fk_criteres: 1, fk_process: 2},
    {fk_criteres: 2, fk_process: 2},
]
const critereTypes = [
    {id: 1, type: "Aspect"},
    {id: 2, type: "Autres"},
    {id: 3, type: "Addons"}
]

export const getCriteres = (req, res) => {
    //@todo retrieve data from db
    res.send(criteres);
}

export const getAllCritereProcess = (req, res) => {
    //@todo retrieve data from db
    res.send(criteresProcess);
}

export const getAllCriteresByProcess = (req, res) => {
    //@todo retrieve data from db
    let listCritId = [];
    let critToSend = [];
    for (let i = 0; i < criteres_process_joinTable.length; i++) {
        if (criteres_process_joinTable[i].fk_process === parseInt(req.params['idProcess'])) {
            listCritId.push(criteres_process_joinTable[i].fk_criteres);
        }
    }
    for (let i = 0; i < criteres.length; i++) {
        for (let j = 0; j <= listCritId.length; j++) {
            if (criteres[i].id === listCritId[j]) {
                critToSend.push(criteres[i]);
            }
        }
    }

    res.send(critToSend);
}

export const getAllTypesCriteres = (req, res) => {
    //@todo retrieve data from db
    res.send(critereTypes);
}
