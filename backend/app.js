import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connect from './db/config.js'
import user from './routes/User.routes.js'

const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()
connect()

app.use('/user', user)


app.listen(process.env.PORT, console.log(`Servidor rodando na porta: ${process.env.PORT}`))