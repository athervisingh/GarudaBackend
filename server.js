const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const basicInfoRoute = require('./routes/basicInfo')
const aoisRoute = require('./routes/aois')

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(bodyParser.json())
app.use(express.static('frontend/dist'))

app.use('/api/basic-info', basicInfoRoute)
app.use('/api/aois', aoisRoute)

app.listen(3000, () => console.log('🚀 Server started at http://localhost:3000'))
