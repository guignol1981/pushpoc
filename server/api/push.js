const express = require('express');
const router = express.Router();
const path = require('path');

/**
 * Downloading Website Package
 */
router.post(`/v2/pushPackages/${process.env.WEB_PUSH_ID}`, (req, res) => {
    console.log('Downloading Website Package called')

    var exec = require("child_process").exec;

    exec("php " + path.join(__dirname, 'createPushPackage.php ' + path.join(__dirname, 'cert.p12')), (error, stdout) => {

        console.debug(error);
        console.debug(stdout);

        res.send(stdout);
    });
});

/**
 * Registering or Updating Device Permission Policy
 */
router.post(`/v2/devices/:device_token/registration/${process.env.WEB_PUSH_ID}`, (req, res) => {
    console.log('Registering or Updating Device Permission Policy called');
});

/**
 * Forgetting Device Permission Policy
 */
router.delete(`/v2/devices/:device_token/${process.env.WEB_PUSH_ID}`, (req, res) => {
    console.log('Forgetting Device Permission Policy called');
});

module.exports = router;
