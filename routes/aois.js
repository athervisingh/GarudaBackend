const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs-extra')
const path = require('path')

// POST /api/aois
router.post('/', async (req, res) => {
  try {
    const aois = req.body

    if (!Array.isArray(aois)) {
      return res.status(400).json({ error: 'Expected an array of AOIs' })
    }

    const geoIdMappings = []

    for (const aoi of aois) {
      const geoentityId = `geo-${uuidv4()}`

      const fullAOI = {
        ...aoi,
        geoentityId // ✅ overwrite any blank value
      }

      const fileName = `${aoi.featureName.replace(/\s+/g, '_')}_${Date.now()}.json`
      const filePath = path.join(__dirname, '../aois', fileName)

      await fs.outputJson(filePath, fullAOI, { spaces: 2 })

      geoIdMappings.push({ name: aoi.featureName, geoentityId })
    }

    res.status(200).json(geoIdMappings)
  } catch (err) {
    console.error('Error saving AOIs:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router
