const express = require('express');
const router = express.Router();
const path = require('path');

router.get(`/${process.env.BASE_URL}/v2/:device_token/${process.env.WEB_PUSH_ID}`, (req, res) => {
    console.log(1);
});

router.post(`/${process.env.BASE_URL}/v2/:device_token/${process.env.WEB_PUSH_ID}`, (req, res) => {
    console.log(2);
});

router.delete(`/${process.env.BASE_URL}/v2/:device_token/${process.env.WEB_PUSH_ID}`, (req, res) => {
    console.log(3);
});

router.post(`/${process.env.BASE_URL}/v2/pushPackage/${process.env.WEB_PUSH_ID}`, (req, res) => {
    var exec = require("child_process").exec;

    exec("php " + path.join(__dirname, 'createPushPackage.php ' + path.join(__dirname, 'cert.p12')), function
        (error, stdout, stderr) {

        console.debug(error);
        console.debug(stdout);

        res.send(stdout);
    });
});

module.exports = router;
