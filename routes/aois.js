const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');

router.post('/', async (req, res) => {
  try {
    const aois = req.body;

    if (!Array.isArray(aois)) {
      return res.status(400).json({ error: 'Expected an array of AOIs' });
    }

    const aoiIds = [];

    for (const aoi of aois) {
      const generatedId = `geo-${uuidv4()}`;
      aoi.aoiId = generatedId; // ✅ use 'aoiId' as the correct key

      const fileName = `${aoi.featureName.replace(/\s+/g, '_')}.json`;
      const filePath = path.join(__dirname, '../aois', fileName);

      await fs.outputJson(filePath, aoi, { spaces: 2 });

      aoiIds.push(generatedId);
    }

    res.status(200).json(aoiIds); // ✅ return only aoiId values
  } catch (err) {
    console.error('Error saving AOIs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
