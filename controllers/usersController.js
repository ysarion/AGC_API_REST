const usersController = [
    {id: 1, firstname: 'jeremy', lastName: 'Daix', BE: 117059, Role: 'User', Equipe: null, Tracabilite: null},
    {id: 2, firstname: 'Pierre', lastName: 'Faidherbe', BE: 117060, Role: 'User', Equipe: null, Tracabilite: null}
]

export const getUsers = (req, res) => {
    //@todo retrieve data from db
    res.send(usersController);
}

export const getUser = (req, res) => {
    //@todo retrieve data from db
    res.send(usersController[parseInt(req.params.id)]);
}

export const postUser = (req, res) => {
    //@todo post data in db
    const user = req.body;
    usersController.push(user);
    res.send('ok');
}
