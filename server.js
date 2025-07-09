

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express()
const basicInfoRoute = require('./routes/basicInfo')
const aoisRoute = require('./routes/aois')
const projectUserRoutes = require('./routes/project-users');
const userProjectsRoute = require('./routes/user-projects');
const monitoredProjectsRoute = require('./routes/monitored-project');
// ✅ FIX CORS
app.use(cors({
  origin: 'https://garuda-frontend.vercel.app', // Adjust this to your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}))
// app.options('*', cors()) // handles preflight requests

app.use(bodyParser.json())
app.use(express.static('frontend/dist'))

app.use('/api/basic-info', basicInfoRoute)
app.use('/api/aois', aoisRoute)
app.use('/api/project-users', projectUserRoutes)
app.use('/api/user-projects', userProjectsRoute)
app.use('/api/monitored-projects', monitoredProjectsRoute)
app.listen(3000, () => console.log('🚀 Server started at http://localhost:3000'))
