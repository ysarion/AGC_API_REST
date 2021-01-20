const crashQualites = [
    {
        id: 1,
        fk_user: 1,
        fk_equipe: 1,
        fk_machine: 1,
        fk_ligne: 1,
        fk_articles: 1,
        nbPieces: 316,
        description: "blablablablablablablablablablablablablablablablablablablabla",
        dateCrash: "2016-12-21 8:00:00.000",
    },{
        id: 2,
        fk_user: 1,
        fk_equipe: 2,
        fk_machine: 2,
        fk_ligne: 3,
        fk_articles: 2,
        nbPieces: 316,
        description: "blablablablablablablablablablablablablablablablablablablabla",
        dateCrash: "2018-12-21 15:00:00.000",
    }
]

export const getCrashQualites = (req, res) => {
    //@todo retrieve data from db
    res.send(crashQualites);
}

export const getCrashQualite = (req, res) => {
    //@todo retrieve data from db
    for (let i = 0; i < crashQualites.length; i++) {
        if (crashQualites[i].id === parseInt(req.params['id'])) {
            res.send(crashQualites[i]);
            return;
        }
    }
}

export const postCrashQualite = (req, res) => {
    //@todo retrieve data from db
    crashQualites.push(req.body);
    res.send("ok");
}
