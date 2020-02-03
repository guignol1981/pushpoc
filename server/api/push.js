const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

/**
 * Downloading Website Package
 */
router.post(`/v2/pushPackages/${process.env.WEB_PUSH_ID}`, (req, res) => {
    fs.readFile(path.join(__dirname, '../../pushPackage.zip'), function (error, data) {
        res.writeHead(200, { 'Content-Type': 'application/zip' });
        res.end(data);
    });
});

/**
 * Registering or Updating Device Permission Policy
 */
router.post(`/v2/devices/:deviceToken/registrations/${process.env.WEB_PUSH_ID}`, (req, res) => {
    console.log('Registering or Updating Device Permission Policy called');
});

/**
 * Forgetting Device Permission Policy
 */
router.delete(`/v2/devices/:deviceToken/${process.env.WEB_PUSH_ID}`, (req, res) => {
    console.log('Forgetting Device Permission Policy called');
});

/**
 * Logging Errors
 *
 * pas clair pourquoi mais le module pushNotification de l'object Safari n'appel pas v2
 */
router.post('/v1/log', (req, res) => {
    console.log('Logging Errors called');
    console.log(req.body);
});

module.exports = router;
