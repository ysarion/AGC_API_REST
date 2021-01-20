const tris = [
    {
        id: 1,
        fk_user: 1,
        fk_articles: 1,
        fk_typeTris: 1,
        fk_market: 1,
        numGallia: 14524455,
        numOS: 888723,
        numContainer: 150551,
        nbPieces: 316,
        commentaire: null,
        dateDeb: "2016-12-21 8:00:00.000",
        dateFin: "2016-12-21 16:00:00.000"
    },
    {
        id: 2,
        fk_user: 2,
        fk_articles: 1,
        fk_typeTris: 3,
        fk_market: 1,
        numGallia: 5422445,
        numOS: 64121,
        numContainer: 887126,
        nbPieces: 135,
        commentaire: null,
        dateDeb: "2016-12-21 8:00:00.000",
        dateFin: "2016-12-21 16:00:00.000"
    }
]

export const getTris = (req, res) => {
    //@todo retrieve data from db
    res.send(tris);
}

export const getTri = (req, res) => {
    //@todo retrieve data from db
    for (let i = 0; i < tris.length; i++) {
        if (tris[i].id === parseInt(req.params['id'])) {
            res.send(tris[i]);
            return;
        }
    }
}

export const postTri = (req, res) => {
    //@todo retrieve data from db
    tris.push(req.body);
    res.send("ok");
}
