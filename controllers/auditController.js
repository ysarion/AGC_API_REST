const audits = [
    {
        id: 1,
        fk_user: 1,
        fk_articles: 1,
        four: "Four 1",
        numContainer: 150551,
        totalVerres: 124,
        resultPourcentage: 98,
        objectifAnnuel: 97,
        rating: "A",
        commentaireGeneral: null,
        dateDeb: "2016-12-21 8:00:00.000",
        dateFin: "2016-12-21 16:00:00.000"
    },
    {
        id: 2,
        fk_user: 1,
        fk_articles: 1,
        four: "Four 1",
        numContainer: 145254,
        totalVerres: 154,
        resultPourcentage: 97,
        objectifAnnuel: 97,
        rating: "B",
        commentaireGeneral: null,
        dateDeb: "2016-12-23 8:00:00.000",
        dateFin: "2016-12-23 16:00:00.000"
    }
]

export const getAudits = (req, res) => {
    //@todo retrieve data from db
    res.send(audits);
}

export const getAudit = (req, res) => {
    //@todo retrieve data from db
    for (let i = 0; i < audits.length; i++) {
        if (audits[i].id === parseInt(req.params['id'])) {
            res.send(audits[i]);
            return;
        }
    }
}

export const postAudit = (req, res) => {
    //@todo retrieve data from db
    audits.push(req.body);
    res.send("ok");
}
