const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs-extra')
const path = require('path')

// POST /api/basic-info
router.post('/', async (req, res) => {
  try {
    const basicInfo = req.body

    // ✅ Validate required fields
    if (!basicInfo.projectName || !basicInfo.userId) {
      return res.status(400).json({ error: 'projectName and userId are required' })
    }

    // ✅ Use existing projectID if present, else generate a new one
    const projectID = basicInfo.projectID || `project-${uuidv4()}`
    basicInfo.projectID = projectID // Ensure it gets stored

    // ✅ Save as project_<projectID>.json in /projects
    const fileName = `${projectID}.json`
    const filePath = path.join(__dirname, '../projects', fileName)

    await fs.outputJson(filePath, basicInfo, { spaces: 2 })

    // ✅ Send back just the ID
    res.json({ projectID })
  } catch (err) {
    console.error('❌ Error saving basic info:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router
