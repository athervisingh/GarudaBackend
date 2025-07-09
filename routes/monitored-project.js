const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId query param is required.' });
    }

    const results = [];

    // === 1. Check in "projects/" folder ===
    const projectsFolder = path.join(__dirname, '../projects');
    const projectFiles = await fs.readdir(projectsFolder);

    for (const file of projectFiles) {
      if (file.endsWith('.json')) {
        const filePath = path.join(projectsFolder, file);
        const data = await fs.readJson(filePath);

        if (data.userId === userId) {
          results.push({
            projectID: data.projectID,
            projectName: data.projectName,
            role: 'owner',
          });
        }
      }
    }

    // === 2. Check in "users/" folder ===
    const usersFolder = path.join(__dirname, '../users');
    const userFiles = await fs.readdir(usersFolder);

    for (const file of userFiles) {
      if (file.endsWith('.json')) {
        const filePath = path.join(usersFolder, file);
        const data = await fs.readJson(filePath);

        if (Array.isArray(data.users)) {
          const matchedUsers = data.users.filter(u => u.userId === userId);

          matchedUsers.forEach(matchedUser => {
            results.push({
              projectID: data.projectId,
              projectName: data.projectName,
              role: matchedUser.role,
            });
          });
        }
      }
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error('❌ Error in /api/monitored-projects:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
