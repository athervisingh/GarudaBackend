const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const usersFile = path.join(__dirname, 'users', 'users.json')
const app = express()

// Enable CORS for frontend at localhost:5173
app.use(cors({ origin: 'http://localhost:5173' }))

// Parse JSON body
app.use(bodyParser.json())

// Serve static files (optional, if you're building frontend inside same project)
app.use(express.static('frontend/dist'))

// Ensure projects directory exists
const projectsDir = path.join(__dirname, 'projects')
if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir)
}

// Save project
app.post('/api/save-project', (req, res) => {
  try {
    const project = req.body
    const filePath = path.join(projectsDir, `${project.projectId}.json`)
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2))
    res.status(200).send({ status: 'saved' })
  } catch (error) {
    console.error('❌ Error saving project:', error)
    res.status(500).send({ error: 'Failed to save project' })
  }
})


app.get('/api/get-user', (req, res) => {
  try {
    const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf-8'))
    const user = usersData.find(u => u.userId === 'u1') // simulate logged-in user
    if (!user) return res.status(404).send({ error: 'User not found' })
    res.status(200).send(user)
  } catch (error) {
    console.error('❌ Error reading user:', error)
    res.status(500).send({ error: 'Failed to fetch user' })
  }
})

// Start server
app.listen(3000, () => console.log('🚀 Server started at http://localhost:3000'))
