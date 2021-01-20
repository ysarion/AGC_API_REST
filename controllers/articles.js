const articles = [
    {
        idArticle: 1,
        codeArticles: 650187,
        modele: 1,
        numPlan: 4522214,
        descriptionSAP: "PB X TATATA BLALABALA"
    },{
        idArticle: 2,
        codeArticles: 650188,
        modele: 1,
        numPlan: 4522215,
        descriptionSAP: "PB X TATATA BLALABALA"
    },
    {
        idArticle: 3,
        codeArticles: 75016,
        modele: 2,
        numPlan: 5429453,
        descriptionSAP: "PB X TATATA BLALABALA"
    }
]
const articlesModele = [
    {id:1,modele: "vw 260"},
    {id:2,modele: "toyota Corrola"}
]

export const getArticles = (req, res) => {
    //@todo retrieve data from db
    res.send(articles);
}

export const getArticlesModeles = (req, res) => {
    //@todo retrieve data from db
    res.send(articlesModele);
}

export const getCodesArticles = (req, res) => {
    //@todo retrieve data from db
    let listCodesArticles = [];
    for (let i = 0; i< articles.length;i++){
        listCodesArticles.push(articles[i].codeArticles);
    }
    res.send({codeArticles:listCodesArticles});
}

export const getCodesArticlesByModele = (req, res) => {
    //@todo retrieve data from db
    let listCodesArticlesByModel = [];
    for (let i = 0; i< articles.length;i++){
        if(articles[i].modele === parseInt(req.params['idModele'])){
            listCodesArticlesByModel.push(articles[i].codeArticles);
        }
    }
    res.send(listCodesArticlesByModel);
}
