const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs-extra')
const path = require('path')

// POST /api/basic-info
router.post('/', async (req, res) => {
  try {
    const basicInfo = req.body

    // Validation
    if (!basicInfo.projectName || !basicInfo.ssoUserId) {
      return res.status(400).json({ error: 'projectName and ssoUserId are required' })
    }

    // Generate geoentitySourceId
    const geoentitySourceId = `geo-${uuidv4()}`

    // Update object
    basicInfo.geoentitySourceId = geoentitySourceId

    // Optional: Save it as a JSON file
    const fileName = `${basicInfo.projectName.replace(/\s+/g, '_')}_${Date.now()}.json`
    const filePath = path.join(__dirname, '../projects', fileName)

    await fs.outputJson(filePath, basicInfo, { spaces: 2 })

    // Send back just the ID
    res.json({ geoentitySourceId })
  } catch (err) {
    console.error('Error saving basic info:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router
