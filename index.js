import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js'
import criteresRoutes from './routes/criteres.js'
import articlesRoutes from './routes/articles.js'

const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/users', usersRoutes)
app.use('/criteres', criteresRoutes)
app.use('/articles', articlesRoutes)


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

