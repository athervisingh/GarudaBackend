const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

// POST /api/project-users
router.post('/', async (req, res) => {
  try {
    const { projectId, users } = req.body;

    // Validate input
    if (!projectId || !Array.isArray(users)) {
      return res.status(400).json({
        error: 'projectId (string) and users (array) are required.',
      });
    }

    // Prepare folder path
    const folderPath = path.join(__dirname, '../users');
    await fs.ensureDir(folderPath); // Ensure folder exists

    // File name: <projectId>_users_<timestamp>.json
    const fileName = `${projectId}.json`;
    const filePath = path.join(folderPath, fileName);

    // Data to store
    const fileData = {
      projectId,
      users,
      savedAt: new Date().toISOString(),
    };

    // Write file
    await fs.outputJson(filePath, fileData, { spaces: 2 });

    res.status(200).json({ message: 'Users saved successfully', file: fileName });
  } catch (err) {
    console.error('❌ Error saving users:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
