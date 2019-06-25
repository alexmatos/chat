const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const logConfig = require('./config/logConfig')

// VARIÁVEIS DE AMBIENTE
require('dotenv').config({
    path: '.env'
})

// LOGGER
app.use(logConfig.getLogger())

// BODY-PARSER
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

// BANCO DE DADOS
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true
})

// ROTAS


// TRATAMENTO DE ERRO
app.use(logConfig.getErrorLogger())

app.use( (err, req, res, next) => {
    return res.status(500).json({
        status: "error",
        message: err.message,
        data: err
    })
})

let port = process.env.port
app.listen(port, () => console.log(`Aplicação rodando na porta: ${port}.`))