const express = require('express')
const cors = require('cors')
const leadController = require('./controllers/leadController')
const errorHandler = require('./middleware/errorHandler')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/leads', leadController)

app.use(errorHandler)

module.exports = app
